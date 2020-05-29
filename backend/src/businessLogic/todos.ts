import { TodoItem } from '../models/TodoItem'
import { TodoItemAccess } from '../dataLayer/todosAccess'
import { APIGatewayProxyEvent } from 'aws-lambda';

import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { createLogger } from '../utils/logger'

const todoItemAccess = new TodoItemAccess()
const logger = createLogger('businessLogic');

export async function getAllTodoItems(): Promise<TodoItem[]> {
  return todoItemAccess.getAllTodoItems()
}

export async function createTodoItem(createTodoRequest: CreateTodoRequest): Promise<TodoItem> {

  const createdAt = new Date(Date.now()).toISOString();
  const userId = 'John'
  const todoId = '12'
  
  const newTodo = {
    userId,
    todoId,
    createdAt,
    done: false,
    ...createTodoRequest
  };

  await todoItemAccess.createTodoItem(newTodo);
  logger.info('Creating new todo item');

  return 
}

export async function deleteTodoItem(event: APIGatewayProxyEvent) {
  const todoId = event.pathParameters.todoId;

  if (!(await todoItemAccess.getTodo(todoId))) {
    return false;
  }
  await todoItemAccess.deleteTodoItem(todoId);

  return 
}

export async function updateTodoItem(event: APIGatewayProxyEvent,
                        updateTodoRequest: UpdateTodoRequest) {
  const todoId = event.pathParameters.todoId;

  if (!(await todoItemAccess.getTodo(todoId))) {
    return false;
  }
  await todoItemAccess.updateTodoItem(todoId, updateTodoRequest);
  logger.info('Update todo item');

  return 
}