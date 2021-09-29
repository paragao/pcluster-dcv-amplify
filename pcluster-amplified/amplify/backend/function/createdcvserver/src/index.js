const AWS = require("aws-sdk");
const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = function(event, context, callback) {
    //eslint-disable-line
    console.log(JSON.stringify(event));
    const creationSucess = false
    const updateSucess = false

    event.Records.forEach(record => {
        console.log(record.eventID);
        console.log(record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb);

        // DynamoDB Streams events can be INSERT, UPDATE, DELETE. Only creates an instance if INSERT a new item.
        // Idea (TO-DO): also check if there is an OLD_IMAGE. New items don't have OLD_IMAGE
        // Verify if Amplify allows for ease configuration of not looking at NEW_AND_OLD_IMAGE and just NEW_IMAGE
        if (record.eventName == 'INSERT') {
            try {
                const pkId = record.dynamodb.Keys.id.S 
                // validates if an instance with a tag 'UUID: pkid' already exists. If it does, probably a duplicate, exit. If not, carry on.
                const params = {
                    Filters: [
                        { 
                            Name: "tag:UUID",
                            Values: [
                                pkId
                            ]
                        },
                        { 
                            Name: "instance-state-name",
                            Values: [
                                'running',
                                'stopped'
                            ]
                        }
                    ]
                };
                ec2.describeInstances(params, function(err, data) {
                    if (err) console.log(err, err.stack);
                    else {
                        if (data.Reservations.length != 0) {
                            console.log('Instance already exists')
                            return ('Instance already exists with the same UUID ', data)
                        } else {
                            console.log('instance does not exist, creating it...')
                            // create the EC2 instance if does not exist already
                            const nameTag = record.dynamodb.NewImage.name.S
                            const instanceType = record.dynamodb.NewImage.instanceType.S
                            const launchTemplate = record.dynamodb.NewImage.launchTemplate.S

                            console.log('params: ', nameTag, instanceType, launchTemplate, pkId)
                            const instanceParams = {
                                LaunchTemplate: {
                                    LaunchTemplateId: launchTemplate,
                                    Version: '$Latest'
                                },
                                InstanceType: instanceType,
                                MinCount: 1,
                                MaxCount: 1,
                                TagSpecifications: [
                                    { 
                                        ResourceType: "instance",
                                        Tags: [
                                            { 
                                                Key: 'Name',
                                                Value: nameTag
                                            },
                                            { 
                                                Key: 'DCV',
                                                Value: 'Yes'
                                            },
                                            { 
                                                Key: 'UUID',
                                                Value: pkId
                                            }
                                        ]
                                    }
                                ]
                            }
                            ec2.runInstances(instanceParams, function(err, data) {
                                if (err) console.log(err, err.stack);
                                else {
                                    console.log('const InstanceData returned: ', data)
                                    const instanceId = data.Instances[0].InstanceId
                                    const creationSucess = true
                                    
                                    // ec2.describeInstances will not have results if you don't wait a bit
                                    setTimeout(() => {}, 5000);
                                    const params = { 
                                        InstanceIds: [
                                            instanceId
                                        ]
                                    }

                                    // get the instance PublicIP - might take a while sometimes
                                    ec2.describeInstances(params, function(err, data) {
                                        if (err) console.log(err, err.stack);
                                        else {
                                            console.log('looking up the PublicDnsName')
                                            const tempData = data.Reservations[0].Instances[0].PublicDnsName
                                            console.log(tempData)
                                            while (tempData == '') {
                                                setTimeout(() => {}, 5000)
                                                const data = ec2.describeInstances(params);
                                            }
                                            const instancePublicIp = tempData
                                            console.log('Instance data after it was created: ', instancePublicIp)

                                            // add instance additional information to DynamoDB
                                            const table = record.eventSourceARN.split('/')[1]
                                            console.log('Control Table: ', table)
                                            console.log('Instance ID: ', instanceId)
                                            console.log('PK: ', pkId)
                                            console.log(typeof(pkId))
                                            console.log(typeof(instanceId))
                                            console.log(typeof(instancePublicIp))

                                            ddbParams = {
                                                ExpressionAttributeValues: {
                                                    ":p": {
                                                        S: instancePublicIp
                                                    },
                                                    ":i": {
                                                        S: instanceId
                                                    }
                                                },
                                                Key: { 
                                                    "id": { 
                                                        S: pkId
                                                    }
                                                },
                                                TableName: table,
                                                UpdateExpression: "SET publicip = :p, instanceId = :i"
                                            };
                                            ddb.updateItem(ddbParams, function(err, data) {
                                                if (err) console.log(err, err.stack);
                                                else {
                                                    console.log('updated item sucessfully', data)
                                                    const updateSucess = true
                                                }
                                            });
                                        }
                                    });
                                }
                            })
                        }
                    }
                })

                if (creationSucess && updateSucess) {
                    console.log('Successfully processed DynamoDB stream')
                    return('Successfully processed DynamoDB stream')
                } else { 
                    console.log('some error happened...')
                    return('some error happened...')
                }
            } catch (err) {
                console.log('Missed instance try/catch: ', err);
            }
        } else { 
            console.log('not an INSERT event. Exiting...')
            return('not an INSERT event.')
        }

        if (record.eventName == 'DELETE') {

        } else { 
            console.log('not a DELETE event. Exiting...')
            return('not a DELETE event.')
        }
    })
};
