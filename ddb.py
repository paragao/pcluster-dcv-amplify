import boto3
import json

ddb = boto3.client('dynamodb')

table = 'Instance-nck27ony2fcqtkjtxwfehgpjh4-dev'
response = ddb.scan(TableName=table)

for item in response['Items']:
    id = item['id']
    delRes = ddb.delete_item(
        TableName=table,
        Key={ 
            'id': id
        }
    )
    print(delRes)

