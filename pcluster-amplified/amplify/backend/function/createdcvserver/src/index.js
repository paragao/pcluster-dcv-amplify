const AWS = require("aws-sdk");
const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

async function getInstanceData(params) {
    await ec2.describeInstances(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else { 
            if (data.Reservations.length != 0) {
                console.log('Instance already created for this UUID')
                return false
            } else { 
                console.log('Instance does not exist.')
                return data
            }
        }
    })
    
}

async function updateDynamo(params) {
    const data = await ddb.updateItem(params)
    console.log('updateItem data: ', data)

}

async function createInstance(params) {
    const data = await ec2.runInstances(params)
    console.log('startInstance data: ', data)
}

exports.handler = function(event, context, callback) {
    //eslint-disable-line
    console.log(JSON.stringify(event));
    const creationSucess = false
    const updateSucess = false

    event.Records.forEach(record => {
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
                
                // Verify if instance exists and if not create instance
                try {
                    getInstanceData(params)
                        .then((data) => {
                            if (data) {
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
                                try {
                                    createInstance(params)
                                        .then((instance) => {
                                            const instanceId = instance.Instances[0].InstanceId
                                        })
                                        .catch((err) => console.log('create instance failed: ', err))
                                } catch (err) { 
                                    console.log('create instance missed try/catch: ', err)
                                }
                            }
                        })
                        .catch((err) => console.log('error na promise: ', err));
                } catch (err) {
                    console.log('missed first getInstanceData: ', err)
                }

                try {
                    getInstanceData()
                        .then((newData) => {
                            if 
                        })
                        .catch((err) => console.log('error getting more instance data: ', err))
                } catch (err) { 
                    console.log('missed second getInstanceData: ', err)
                }
            } catch (err) {
                console.log('error: ', err)
            } 
        } else {
            console.log('not an INSERT. Exiting.')
        }

    })
};
