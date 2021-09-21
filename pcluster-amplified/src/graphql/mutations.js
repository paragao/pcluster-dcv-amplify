/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
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
      costCenter
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateUser = /* GraphQL */ `
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
      costCenter
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteUser = /* GraphQL */ `
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
      costCenter
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createInstance = /* GraphQL */ `
  mutation CreateInstance(
    $input: CreateInstanceInput!
    $condition: ModelInstanceConditionInput
  ) {
    createInstance(input: $input, condition: $condition) {
      id
      userID
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
export const updateInstance = /* GraphQL */ `
  mutation UpdateInstance(
    $input: UpdateInstanceInput!
    $condition: ModelInstanceConditionInput
  ) {
    updateInstance(input: $input, condition: $condition) {
      id
      userID
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
export const deleteInstance = /* GraphQL */ `
  mutation DeleteInstance(
    $input: DeleteInstanceInput!
    $condition: ModelInstanceConditionInput
  ) {
    deleteInstance(input: $input, condition: $condition) {
      id
      userID
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
