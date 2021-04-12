'use strict';
const AWS = require('aws-sdk')

module.exports.listUser = async (event, context) => {

  const queryUserParams = {
    TableName: process.env.DYNAMODB_USER_TABLE,
  }

  let userResult = {}

  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    userResult = await dynamodb.scan(queryUserParams).promise()
    
  }catch (queryError){
    console.log("There was an error attempting to retrieve the users")
    console.log("queryError", queryError)
    console.log("queryUserParams", queryUserParams)
    return new Error("There was an error retrieving the users")
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type" : "application/json",
      "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods" : "OPTIONS,GET",
      "Access-Control-Allow-Credentials" : true,
      "Access-Control-Allow-Origin" : "*",
      "X-Requested-With" : "*"
    },
    body: JSON.stringify({
      users: userResult.Items
    }),   
  }
};
