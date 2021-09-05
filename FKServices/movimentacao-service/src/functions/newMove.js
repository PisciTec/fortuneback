'use strict';
const AWS = require('aws-sdk')
const uuid = require('uuid')
module.exports.newMove = async (event, context) => {
  const body = JSON.parse(event.body)
  const siglaBanco = body.siglaBanco
  const userId = body.userId
  const valor = body.valor
  const dataMov = new Date();
  let uuidId = uuid.v1()

  const newMoveParams = {
    TableName : process.env.DYNAMODB_MOVIMENTACAO_TABLE,
    Item : {
      userId,
      movimentacaoId: siglaBanco+uuidId,
      valor,
      dataMovimentacao:dataMov.toLocaleString('pt-BR', { timeZone: 'UTC' }),
    }
  }
  let putResult = {}
  try {
    var dynamodb = new AWS.DynamoDB.DocumentClient()
    putResult = await dynamodb.put(newMoveParams).promise()

  } catch(putError){
    console.log('There was an error putting the new move')
    console.log('putError', putError)
    console.log('newAccountParams', newMoveParams)
    return new Error('There was an error putting the new move')
  }

  let newBankRes = {}
  const paramsAttBanco = {
    TableName : process.env.DYNAMODB_MOVIMENTACAO_TABLE,
    Key : {
      'userId': userId,
      'movimentacaoId': "0000" + siglaBanco,
    },
    UpdateExpression: "SET #df = :dt, #sa = #sa + :v",
    ExpressionAttributeNames: {
      '#df' : 'UltimaMovimentacaoBanco',
      '#sa' : 'SaldoAtual',
    },
    ExpressionAttributeValues: {
        ':v' : valor,
        ':dt' : dataMov.toLocaleString('pt-BR', { timeZone: 'UTC' }),
    },
    ReturnValues:"UPDATED_NEW"
  };
  
  try {
    var documentClient = new AWS.DynamoDB.DocumentClient()

    console.log('Updating the bank')    
    await documentClient.update(paramsAttBanco)
            .promise()
            .then(res => {
              newBankRes = res
            })
            .catch(err=>{
              console.log("Error in request")
              new Error(err.message)
            });     
  }catch (queryError){
    console.log("There was an error updating the bank")
    console.log("queryError", queryError)
    console.log("queryUserParams", paramsAttBanco)
    return new Error("There was an error updating the bank")
    
  }

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
    body: JSON.stringify({
      message: "Movimentação e conta atualizadas com sucesso"
    })
  };

};
