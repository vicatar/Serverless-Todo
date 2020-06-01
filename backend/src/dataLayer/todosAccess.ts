import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { SignedURLRequest} from '../models/SignedUrlRequest'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS);

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

export class TodoItemAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly indexName = process.env.TODO_ID_INDEX,
    private readonly todosTable = process.env.TODOS_TABLE
    ) { }

  async getAllTodoItems(userId: string): Promise<TodoItem[]> {
    console.log('Getting all TodoItems')

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.indexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    return result.Items as TodoItem[]
  }

  async createTodoItem(todoItem: TodoItem) {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()
  }

  async deleteTodoItem(userId: string, todoId: string) {
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      }
    }).promise()
  }

  async getTodo(userId: string, todoId: string) {
    const result = await this.docClient.get({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId,
      }
    }).promise();

    return result.Item as TodoItem;
  }

  async updateTodoItem(userId: string, todoId: string, updatedTodoItem: TodoUpdate) {
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        userId,
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

export function getPresignedUploadURL(createSignedUrlRequest: SignedURLRequest) {
  return s3.getSignedUrl('putObject', createSignedUrlRequest);
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE == "true") {
    console.log('Creating a local DynamoDB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient();
}
