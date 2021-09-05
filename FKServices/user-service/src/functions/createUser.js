'use strict';
const AWS = require('aws-sdk')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')
module.exports.createUser = async (event, context) => {
  const body = JSON.parse(event.body)
  const username = body.username
  const password = "senhaInicial"
  const funcao = body.funcao;
  let uuidId = uuid.v1()
  const nome = body.nome;
  const newUserParams = {
    TableName : process.env.DYNAMODB_USER_TABLE,
    Item : {
      email: username,
      password: bcrypt.hashSync(password, 10), 
      funcao,
      nome,
      userId: uuidId,
    }
  }
  try {
    
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    const putResult = await dynamodb.put(newUserParams).promise()

    return {
      statusCode: 201,
      headers: {
        "Content-Type" : "application/json",
        "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods" : "OPTIONS,POST",
        "Access-Control-Allow-Credentials" : true,
        "Access-Control-Allow-Origin" : "*",
        "X-Requested-With" : "*"
      },      
    };
  } catch(putError){
    console.log('There was an error putting the new item')
    console.log('putError', putError)
    console.log('newUserParams', newUserParams)
    return new Error('There was an error putting the new item')
  }

};
