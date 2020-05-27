import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { createTodoItem } from '../../businessLogic/todos';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  console.log('Create todo: ', newTodo)

  const todos = await createTodoItem(newTodo)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: todos
    })
  }
}
