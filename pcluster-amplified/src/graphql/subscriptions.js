/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
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
export const onUpdateUser = /* GraphQL */ `
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
export const onDeleteUser = /* GraphQL */ `
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
export const onCreateInstance = /* GraphQL */ `
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
export const onUpdateInstance = /* GraphQL */ `
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
export const onDeleteInstance = /* GraphQL */ `
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
