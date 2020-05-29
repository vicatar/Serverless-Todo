import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

export class TodoItemAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
//    private readonly indexName = process.env.TODO_ID_INDEX,
    private readonly todosTable = process.env.TODOS_TABLE
    ) { }

  async getAllTodoItems(): Promise<TodoItem[]> {
    console.log('Getting all TodoItems')

    const result = await this.docClient.scan({
      TableName: this.todosTable
//      IndexName: this.indexName,
    }).promise()

    return result.Items as TodoItem[]
  }

  async createTodoItem(todoItem: TodoItem) {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()
  }

  async deleteTodoItem(todoId: string) {
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        todoId
      }
    }).promise()
  }

  async getTodo(todoId: string) {
    const result = await this.docClient.get({
      TableName: this.todosTable,
      Key: {
        todoId,
      }
    }).promise();

    return result.Item as TodoItem;
  }

  async updateTodoItem(todoId: string, updatedTodoItem: TodoUpdate) {
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        todoId
      },
      UpdateExpression: 'set #name = :n, #dueDate = :due, #done = :d',
      ExpressionAttributeValues: {
        ':n': updatedTodoItem.name,
        ':due': updatedTodoItem.dueDate,
        ':d': updatedTodoItem.done
      },
      ExpressionAttributeNames: {
        '#name': 'name',
        '#dueDate': 'dueDate',
        '#done': 'done'
      }
    }).promise();
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE == "true") {
    console.log('Creating a local DynamoDB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}
