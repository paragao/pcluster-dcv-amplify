# Front-end for AWS ParallelCluster and NICE DCV using AWS Amplify

Contents of this README
 * Pre-Requisites
 * Initializing the project
 * React project
 * Help


## Pre-Requisites
There is a Dev-Container folder. If you use VSCode, you can enable the Remote-Containers extension and open this folder in your Dev-Container. Everything that you need to start the project will be there already. 

If you don't want to use the Dev-Container, make sure you have already installed: 
 1. NodeJS v16 or later
 2. npm v5.x or later

You are also going to need an AWS Account. 


## Initializing the project
Make sure you create an user with the right set of permissions. If you are not sure, you can start by attaching the `AdministratorAccess` policy to the user that you are going to create the credentials and then scope down using the AWS IAM Access Analyzer. 

First, let's configure AWS Amplify and create the credentials file. 
```
amplify configure
```

Make sure you name your profile `default`.

After you follow the prompts for creating your user and generating the AWS credentials, a file will be created for you on `${HOME}/.aws/credentials`. AWS Amplify will use those credentials when creating the backend resources on your AWS account. You can also use the same credentials on the AWS Toolkit for VSCode. If you are using the Dev-Container, the extension is already installed for you and you just have to choose your profile on the lower right bar of VSCode.


## React project
This is a web site project based on React that will help you manage a fleet of DCV Servers. The resources needed to configure NICE DCV were already deployed using the AWS Cloudformation template provided. Make sure you have successfully deployed the basic resources before you continue.

## Enhancing the project
You can benefit from local mocking of the API endpoint in order to speed up development. In order to do that, make any changes you want to your GraphQL schema (usually placed in `amplify/backend/api/pclusteramplified/schema.graphql`) and then run the command:
```
amplify mock api
```

This will start a local endpoint on port `20002`. Just point your browser to [`http://localhost:20022`](http://localhost:20022). 

## Help

