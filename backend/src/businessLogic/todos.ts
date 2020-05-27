import { TodoItem } from '../models/TodoItem'
import { TodoItemAccess } from '../dataLayer/todosAccess'

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
