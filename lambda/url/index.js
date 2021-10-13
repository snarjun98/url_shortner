var AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();
const { nanoid } = require('nanoid');
var table=process.env.TABLE_NAME;
var invoke_url="https://hbzprbm9eb.execute-api.us-east-2.amazonaws.com/prod/urlShortner/";
var uid=nanoid();

exports.handler = async (event) => {
    // TODO implement
    switch (true) {
        case event.httpMethod ==='GET':
            const code=event.pathParameters['short-code']
            if(!code){
                const response = {
                 statusCode: 404,
                    body:{
                        message:"Path params is required"
                    }
                            };
                            return response;
            }
            var result=await docClient.get({TableName: table, Key: {"short_code":event.pathParameters['short-code'] }}).promise();
            if(result.Item){
            const response = {
                 statusCode: 301,
                    headers: {
                         Location: result.Item.long_url
                         }
                            };
    return response;
            }else{
                const response = {
                 statusCode: 400,
                    body:{
                        message:"Data not found"
                    }
                            };
                            return response;
            }
            
            
        case event.httpMethod ==='POST':
        try {
            const long_url_Value = JSON.parse(event.body);
            const url=long_url_Value.long_url
            if(!url || !long_url_Value || url===""){
                const response = {
                 statusCode: 404,
                    body:{
                        message:"long_url is required"
                    }
                            };
                            return response;
            }
            const params={
            TableName:table,
            Item:{
                "short_code":uid,
                "long_url":long_url_Value.long_url
                }
            };
             await docClient.put(params).promise();
            return { 
                body:(invoke_url+uid) };
            } catch (err) {
           return err;
  }
          
        default:
            return{body:"not valid method"};
    }
};