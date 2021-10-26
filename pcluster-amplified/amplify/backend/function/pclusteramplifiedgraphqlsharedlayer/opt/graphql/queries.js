"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listUsers = exports.listInstances = exports.getUser = exports.getInstance = void 0;

/* eslint-disable */
// this is an auto generated file. This will be overwritten
const getUser =
/* GraphQL */
`
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
exports.getUser = getUser;
const listUsers =
/* GraphQL */
`
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
exports.listUsers = listUsers;
const getInstance =
/* GraphQL */
`
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
exports.getInstance = getInstance;
const listInstances =
/* GraphQL */
`
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
exports.listInstances = listInstances;