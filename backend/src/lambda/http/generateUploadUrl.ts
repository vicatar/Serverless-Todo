import 'source-map-support/register'
import { generateUploadUrl } from '../../businessLogic/todos';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const signedUrl = await generateUploadUrl(event);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: signedUrl
    })
  }
}
