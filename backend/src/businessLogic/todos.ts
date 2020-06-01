import * as uuid from 'uuid';

import { TodoItem } from '../models/TodoItem'
import { TodoItemAccess, getPresignedUploadURL } from '../dataLayer/todosAccess'
import { APIGatewayProxyEvent } from 'aws-lambda';

import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { createLogger } from '../utils/logger'
import { getUserId } from '../lambda/utils';

const todoItemAccess = new TodoItemAccess()
const logger = createLogger('businessLogic');
const bucketName = process.env.IMAGES_S3_BUCKET

export async function getAllTodoItems(event: APIGatewayProxyEvent): Promise<TodoItem[]> {
  const userId = getUserId(event);
  logger.info('Get todo items for ', userId);

  return todoItemAccess.getAllTodoItems(userId)
}

export async function createTodoItem(event: APIGatewayProxyEvent,
                    createTodoRequest: CreateTodoRequest): Promise<TodoItem> {

  const createdAt = new Date(Date.now()).toISOString();
  const userId = getUserId(event);
  const todoId = uuid.v4();
  
  const newTodo = {
    userId,
    todoId,
    createdAt,
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`,
    ...createTodoRequest
  };

  logger.info('Creating new todo item');
  await todoItemAccess.createTodoItem(newTodo);

  return newTodo
}   


export async function deleteTodoItem(event: APIGatewayProxyEvent) {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);

  if (!(await todoItemAccess.getTodo(userId, todoId))) {
    return false;
  }
  await todoItemAccess.deleteTodoItem(userId, todoId);

  return 
}

export async function updateTodoItem(event: APIGatewayProxyEvent,
                        updateTodoRequest: UpdateTodoRequest) {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);

  if (!(await todoItemAccess.getTodo(userId, todoId))) {
    return false;
  }
  await todoItemAccess.updateTodoItem(userId, todoId, updateTodoRequest);
  logger.info('Update todo item');

  return 
}

export async function generateUploadUrl(event: APIGatewayProxyEvent) {
  const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
  const todoId = event.pathParameters.todoId;

  const createSignedUrlRequest = {
    Bucket: bucketName,
    Key: todoId,
    Expires: +urlExpiration
  }

  logger.info('Generated Upload URL');
  return getPresignedUploadURL(createSignedUrlRequest);
}