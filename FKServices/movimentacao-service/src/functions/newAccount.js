'use strict';
const AWS = require('aws-sdk')
module.exports.newAccount = async (event, context) => {
  const body = JSON.parse(event.body)
  const siglaBanco = body.siglaBanco
  const userId = body.userId
  const valor = body.valor;
  const dataMov = new Date();
  const newAccountParams = {
    TableName : process.env.DYNAMODB_MOVIMENTACAO_TABLE,
    Item : {
      userId,
      movimentacaoId: "0000" + siglaBanco,
      SaldoInicial : valor,
      SaldoAtual : valor,
      DataCriacaoBanco : dataMov.toLocaleString('pt-BR', { timeZone: 'UTC' }),
      UltimaMovimentacaoBanco : dataMov.toLocaleString('pt-BR', { timeZone: 'UTC' })
    }
  }
  let putResult = {}
  try {
    
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    putResult = await dynamodb.put(newAccountParams).promise()

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
        message: "Nova conta criada com sucesso."
      })
    };
  } catch(putError){
    console.log('There was an error putting the new account')
    console.log('putError', putError)
    console.log('newAccountParams', newAccountParams)
    return new Error('There was an error putting the new account')
  }

};
