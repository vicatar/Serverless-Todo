import { TodoItem } from '../models/TodoItem'
import { TodoItemAccess } from '../dataLayer/todosAccess'
import { APIGatewayProxyEvent } from 'aws-lambda';

import { CreateTodoRequest } from '../requests/CreateTodoRequest'

const todoItemAccess = new TodoItemAccess()

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