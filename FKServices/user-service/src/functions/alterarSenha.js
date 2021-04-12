'use strict';
const bcrypt = require('bcryptjs')
const AWS = require('aws-sdk')

module.exports.alterarSenha = async (event, context) => {
  const body = JSON.parse(event.body)
  const password = body.password
  const user = body.user
  const funcao = body.funcao;
  const params = {
    TableName : process.env.DYNAMODB_USER_TABLE,
    Key : {
      'email': user,
      'funcao': funcao,
    },
    UpdateExpression: "set #senha = :p",
    ExpressionAttributeNames: {'#senha' : 'password'},
    ExpressionAttributeValues: {
        ':p' : bcrypt.hashSync(password, 10),
    },
    ReturnValues:"UPDATED_NEW"
  };
  let userResult = null

  try {
    var documentClient = new AWS.DynamoDB.DocumentClient()
    
    await documentClient.update(params)
            .promise()
            .then(res => {
              userResult = res
            })
            .catch(err=>{
              new Error(err.message)
            });
  }catch (queryError){
    console.log("There was an error attempting to retrieve the user")
    console.log("queryError", queryError)
    console.log("queryUserParams", queryUserParams)
    return new Error("There was an error retrieving the password")
    
  }
  return {
    statusCode: 200,
    headers: {
      "Content-Type" : "application/json",
      "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods" : "OPTIONS,POST",
      "Access-Control-Allow-Credentials" : true,
      "Access-Control-Allow-Origin" : "*",
      "X-Requested-With" : "*"
    },
    body: JSON.stringify({
      msg: "Senha alterada com sucesso.", 
      result: userResult
    })
  }
};  
