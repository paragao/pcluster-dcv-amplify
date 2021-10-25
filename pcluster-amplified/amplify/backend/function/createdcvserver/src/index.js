const AWS = require("aws-sdk");
const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

function getInstanceDetail(params) {
    
    try {
        ec2.describeInstances(params, function(err, data) {
            if (err) console.log('error trying to find an existing instance: ', err, err.stack);
            else { (data.Reservations.length !== 0) ? console.log('Instance already exists with the same UUID ', data) : createInstance(params) }
        });
    } catch (err) {
        console.log('failed describing instances')
    }

}


exports.handler = function(event, context, callback) {
    //eslint-disable-line
    console.log(JSON.stringify(event));

    event.Records.forEach(record => {
        console.log(record.eventID);
        console.log(record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb);

        // DynamoDB Streams events can be INSERT, UPDATE, REMOVE. Only creates an instance if INSERT a new item.
        // Idea (TO-DO): also check if there is an OLD_IMAGE. New items don't have OLD_IMAGE
        // Verify if Amplify allows for ease configuration of not looking at NEW_AND_OLD_IMAGE and just NEW_IMAGE
        if (record.eventName === 'INSERT') {
            try {
                console.log('INSERT event', record.dynamodb)
                const pkId = record.dynamodb.Keys.id.S 
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
                //verify if the instance already exists
                ec2.describeInstances(params, function(err, data) {
                    if (err) console.log('error trying to find an existing instance: ', err, err.stack);
                    else {
                        if (data.Reservations.length !== 0) {
                            return ('Instance already exists with the same UUID ', data)
                        } else {
                            const nameTag = record.dynamodb.NewImage.name.S
                            const instanceType = record.dynamodb.NewImage.instanceType.S
                            const launchTemplate = record.dynamodb.NewImage.launchTemplate.S
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
                            // create the EC2 instance if does not exist already
                            ec2.runInstances(instanceParams, function(err, data) {
                                if (err) console.log('error creating instance: ', err, err.stack);
                                else {
                                    const instanceId = (typeof(data.Instances[0].InstanceId) !== 'undefined') ? data.Instances[0].InstanceId : false; 
                                    if (instanceId) {
                                        const params = { InstanceIds: [instanceId] }
                                        // get the instance PublicIP - might take a while sometimes
                                        setTimeout(() => {
                                            ec2.describeInstances(params, function(err, data) {
                                                if (err) console.log('error getting public IP: ', err, err.stack);
                                                else {
                                                    const instancePublicIp = data.Reservations[0].Instances[0].PublicDnsName
                                                    // add instance additional information to DynamoDB
                                                    // TODO: change this to a call to AppSync GraphQL UpdateInstance 
                                                    // TODO: look at Amplify Docs, Guides, Function, on how to add a layer with the mutations
                                                    // TODO: then I can onUpdateInstance subscribe instead of multiple refreshes of the website to show the publicIP
                                                    const table = record.eventSourceARN.split('/')[1]
                                                    const ddbParams = {
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
                                                    try {
                                                        ddb.updateItem(ddbParams, function(err, data) {
                                                            if (err) console.log(err, err.stack);
                                                            else {
                                                                console.log('updated item sucessfully')
                                                            }
                                                        });
                                                    } catch (err) {
                                                        console.log('error updating DynamoDB ', err)
                                                    }
                                                }
                                            })
                                        }, 3000);
                                    } else {
                                        console.log('instanceId not set. Make sure it does not show up in the console: ', instanceId)
                                    }
                                }
                            })
                        }
                    }
                });
            } catch (err) {
                console.log('Missed instance try/catch: ', err);
            }
        } else { 
            if (record.eventName === 'REMOVE') {
                console.log('delete event: ', record.dynamodb)
                const instanceId = (typeof(record.dynamodb.OldImage.instanceId) !== 'undefined') ? record.dynamodb.OldImage.instanceId.S : null;
                if (instanceId !== null) {
                    const params = { InstanceIds: [instanceId] }
                    try {
                        ec2.terminateInstances(params, function(err, data) {
                            if (err) console.log(err, err.stack);
                            else console.log('instance deleted', data);
                        });
                    } catch (err) { 
                        console.log('failed deleting instance ', err)
                    }
                } else { 
                    console.log('no instanceId defined')
                }
            } else {
                console.log('not an INSERT or REMOVE event. Exiting...')
                return('not an INSERT or REMOVE event.')
            }
        }
    })
};
