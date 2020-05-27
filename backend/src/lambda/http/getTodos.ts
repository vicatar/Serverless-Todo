import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllTodoItems } from '../../businessLogic/todos';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('Processing event: ', event)

  const todos = await getAllTodoItems()

  return {
    statusCode: 200,
    headers: {
    //  'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: todos
    })
  }
}
