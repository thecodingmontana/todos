export interface User {
  id: string
  email: string
  username: string
  avatar: string
}

export interface Todo {
  id: string
  name: string
  is_completed: boolean
  userId: string
  createdAt: string
  updatedAt: string
}
