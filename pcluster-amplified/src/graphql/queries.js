/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getInstance = /* GraphQL */ `
  query GetInstance($id: ID!) {
    getInstance(id: $id) {
      id
      status
      name
      instanceType
      instanceId
      publicip
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
        status
        name
        instanceType
        instanceId
        publicip
        tags
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
