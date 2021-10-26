# Demo - Managed DCV solution (backend)

This demo delivers a portal that will allow users to log in using Amazon Cognito and manage their NICE DCV instances on AWS. It uses automation through AWS Systems Manager in order to scan for idling connections and stop the servers. It also allows customers to list all DCV instances running, stopped, and terminated. And it allows users to start their DCV Sessions right from the portal. 

This is by far a complete thorough solution. This demos allows customer to grasp how easy it is to managed Windows-based DCV instances when not using solutions such as Amazon AppStream or AWS ParallelCluster. It supports Linux-based DCV instances as well, as those not running with GPU. But for Linux-based instances I would suggest customers investigate this workshop [here](https://dcv-batch.workshop.aws/) which explains how to use AWS Batch to spin up Linux-based DCV instances on containers, using Spot instances, and managing the lifecycle of the instances automatically. 

This solution was created based on a customer feedback, and it integrates many of this specific customer's needs. I am more than happy to hear from other customers, and fellow colleagues, to learn how to improve the solution. Also, feel free to clone it/fork it and develop your own. 
&nbsp;


In the next sections I will go through the steps required to run this demo, and explain a bit of how it is setup. Before you run this demo, either make sure you have setup the solution following the steps below or that you have deployed in by using the AWS CloudFormation stack provided [here](https://www.github.com/paragao/pcluster-dcv-amplify/backend/dcv-start-stop.yaml) 

The AWS CloudFormation template takes the following parameters:
 1. `Security Group` to associate with the instances being created. Make sure this Security Group allows inbound traffic on TCP port 8443, which is the default NICE DCV port;
 2. `EC2 Key Pair` which will be used to decrypt the default Windows password created on instance creation. You can also modify the Launch Template after the template was deployed and either domain join the AMI or customize the AMI with additional parameters, such as a default password, by using the [EC2 LaunchV2](https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/ec2launch-v2.html);
 3. `Instance` to explicit define which instance type to be used on the Launch Template. If you are launching EC2 instances using either the frontend provided in this project, or via the Amazon EC2 RunInstances API call, you can override that value;
 4. `Minutes` to define the amount of minutes that the SSM Maintenance Window will run. Similar to a cron job;
 5. `Tag` and `Tag Value` are used by the SSM Maintenance Window to identify which instances it should target. Make sure you **do not use** an existing tag/value since that would also target those other instances;
 6. `Action` to define if the instance will either be stopped or terminated when idle.
 &nbsp; 

***

### AWS SSM Maintenance Window & AWS SSM Document
This solution relies heavily on AWS Systems Manager in order to run a script that will either stop or shutdown the DCV instance. It combines SSM Documents being called by a SSM RunCommand API based on a cron job scheduled by SSM Maintenance Window.

You can view the SSM Document created, as well as the SSM Maintenance Window, by going to the [AWS Systems Manager console](https://console.aws.amazon.com/systems-manager)

Below is the code that was implement on the SSM Document. As you can see, it is a Powershell script hence it will only work on Windows. For Linux, please write your own SSM Document and associate with Linux based instances. 

The script is simple: it start by checking if there are active connections to the DCV server by listing them using the DCV CLI, then it waits a bit in order to check if anyone will connect and avoid spinning up/down instance too fast, and then if noone connects after a certain amount of time it sends a message to a topic which calls an AWS Lambda function to either stop or terminate the instance.

If you want the script to loop less, or wait a different amount of time, feel free to change the timers. 

```
 ---
schemaVersion: "2.2"
description: "Command Document Example JSON Template"
parameters:
  commands:
    type: "String"
    description: "List DCV Sessions that are connected"
    default: 
      $stopWatch = New-Object -TypeName System.Diagnostics.StopWatch;
      $timer = New-TimeSpan -Minutes 30;
      $stopWatch.Start();
      
      $conn = Invoke-Expression -Command 'C:\Program` Files\NICE\DCV\Server\bin\dcv list-connections -j console |ConvertFrom-Json';
      if ($conn) {
          Write-Host "There are active connections. Exiting.";
          exit
      } else {
          Start-Sleep -Seconds 60;
          while ($stopWatch.Elapsed -le $timer) {
              $conn = Invoke-Expression -Command 'C:\Program` Files\NICE\DCV\Server\bin\dcv list-connections -j console |ConvertFrom-Json';
              if (!$conn) {
                  Start-Sleep -Seconds 60;
              } else {
                  Write-Host "There are active connections. Exiting."
                  exit
              }
          }
          if (!$conn) {
              Write-Host "No connections for 30min. Sending message to topic.";
              $instance_id = Get-EC2InstanceMetadata -Category InstanceId;
              Publish-SNSMessage -TopicArn 'arn:aws:sns:us-east-1:441224055073:DCV_below_CPU_average' -Message "{""default"":""${instance_id}""}" -MessageStructure 'json' -Subject 'DCV user disconnected';
          } else { 
              Write-Host "Some error occurred and the message was not posted."
              exit
          }
      }
      
mainSteps:
- action: "aws:runPowerShellScript"
  name: runPowerShellScript
  inputs:
    timeoutSeconds: 2100
    runCommand:
    - "{{ commands }}" 
```
&nbsp;

## Creating NICE DCV instances programmaticaly
You can either create DCV instances on the [Amazon EC2 console](https://console.aws.amazon.com/ec2) or by calling the Amazon EC2 API RunInstances. An example can be found here.
&nbsp;

## Acessing the NICE DCV instances
Make sure your security groups are open on port 8443 for the appropriate CIDR range or specific IP. NICE DCV by default sign its own SSL certificate, so expect to get a warning which you can safely ignore. 