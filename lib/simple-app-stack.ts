import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
export class SimpleAppStack extends cdk.Stack {
  public  dynoURLTable :dynamodb.Table;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.dynoURLTable = new dynamodb.Table(this,'URLshortner_table',{
      tableName:"URLshortner",
      partitionKey: { name: 'short_code', type: dynamodb.AttributeType.STRING },
    })

    const URLshortner = new lambda.Function(this, 'URLshortner_function', {
      runtime: lambda.Runtime.NODEJS_14_X,    // execution environment
      code: lambda.Code.fromAsset('lambda/url'),  // code loaded from "lambda" directory
      handler: 'index.handler',                // file is "index", function is "handler"
      environment:{
        TABLE_NAME: this.dynoURLTable.tableName
      }
    });
    this.dynoURLTable.grantFullAccess(URLshortner);
  const api= new apigw.LambdaRestApi(this,'urlShortner_api',{handler:URLshortner , proxy:false})
  const apiResource = api.root.addResource('urlShortner')
  apiResource.addMethod('POST');
  apiResource.addResource('{short-code}').addMethod('GET');
  }
}
