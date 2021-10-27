"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onUpdateUser = exports.onUpdateInstance = exports.onDeleteUser = exports.onDeleteInstance = exports.onCreateUser = exports.onCreateInstance = void 0;

/* eslint-disable */
// this is an auto generated file. This will be overwritten
const onCreateUser =
/* GraphQL */
`
  subscription OnCreateUser {
    onCreateUser {
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
exports.onCreateUser = onCreateUser;
const onUpdateUser =
/* GraphQL */
`
  subscription OnUpdateUser {
    onUpdateUser {
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
exports.onUpdateUser = onUpdateUser;
const onDeleteUser =
/* GraphQL */
`
  subscription OnDeleteUser {
    onDeleteUser {
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
exports.onDeleteUser = onDeleteUser;
const onCreateInstance =
/* GraphQL */
`
  subscription OnCreateInstance {
    onCreateInstance {
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
exports.onCreateInstance = onCreateInstance;
const onUpdateInstance =
/* GraphQL */
`
  subscription OnUpdateInstance {
    onUpdateInstance {
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
exports.onUpdateInstance = onUpdateInstance;
const onDeleteInstance =
/* GraphQL */
`
  subscription OnDeleteInstance {
    onDeleteInstance {
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
exports.onDeleteInstance = onDeleteInstance;