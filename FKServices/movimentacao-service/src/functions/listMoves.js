'use strict';
const AWS = require('aws-sdk')
module.exports.listMoves = async (event, context) => {
  const queryMovesParams = {
    TableName: process.env.DYNAMODB_MOVIMENTACAO_TABLE,
  }

  let moveResult = {}

  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    moveResult = await dynamodb.scan(queryMovesParams).promise()
    
  }catch (queryError){
    console.log("There was an error attempting to retrieve the users")
    console.log("queryError", queryError)
    console.log("queryUserParams", queryMovesParams)
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
      moves: moveResult.Items
    }),   
  }

};
