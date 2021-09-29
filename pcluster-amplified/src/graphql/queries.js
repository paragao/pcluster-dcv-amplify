/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      instances {
        items {
          id
          userID
          status
          name
          launchTemplate
          instanceType
          instanceId
          publicip
          numberInstancesPerCall
          tags
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      costCenter
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        instances {
          nextToken
        }
        costCenter
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getInstance = /* GraphQL */ `
  query GetInstance($id: ID!) {
    getInstance(id: $id) {
      id
      userID
      status
      name
      launchTemplate
      instanceType
      instanceId
      publicip
      numberInstancesPerCall
      tags
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listInstances = /* GraphQL */ `
  query ListInstances(
    $filter: ModelInstanceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInstances(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userID
        status
        name
        launchTemplate
        instanceType
        instanceId
        publicip
        numberInstancesPerCall
        tags
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
