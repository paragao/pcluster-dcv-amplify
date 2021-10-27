"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUser = exports.updateInstance = exports.deleteUser = exports.deleteInstance = exports.createUser = exports.createInstance = void 0;

/* eslint-disable */
// this is an auto generated file. This will be overwritten
const createUser =
/* GraphQL */
`
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
exports.createUser = createUser;
const updateUser =
/* GraphQL */
`
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    UpdateUser(input: $input, condition: $condition) {
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
exports.updateUser = updateUser;
const deleteUser =
/* GraphQL */
`
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
exports.deleteUser = deleteUser;
const createInstance =
/* GraphQL */
`
  mutation CreateInstance(
    $input: CreateInstanceInput!
    $condition: ModelInstanceConditionInput
  ) {
    createInstance(input: $input, condition: $condition) {
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
exports.createInstance = createInstance;
const updateInstance =
/* GraphQL */
`
  mutation UpdateInstance(
    $input: UpdateInstanceInput!
    $condition: ModelInstanceConditionInput
  ) {
    updateInstance(input: $input, condition: $condition) {
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
exports.updateInstance = updateInstance;
const deleteInstance =
/* GraphQL */
`
  mutation DeleteInstance(
    $input: DeleteInstanceInput!
    $condition: ModelInstanceConditionInput
  ) {
    deleteInstance(input: $input, condition: $condition) {
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
exports.deleteInstance = deleteInstance;