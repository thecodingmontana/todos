import { v4 as uuidv4 } from 'uuid'
import { useNetwork } from '@vueuse/core'
import type { Todo } from '~/types'

export const useRxdb = () => {
  const network = reactive(useNetwork())
  const { user } = useUserSession()
  const rxdbService = useNuxtApp().$rxdbService

  return {
    addTodo: async (title: string) => {
      const now = new Date().toISOString()
      const newTodo: Todo = {
        id: uuidv4(),
        name: title,
        is_completed: false,
        createdAt: now,
        updatedAt: now,
        userId: user.value?.id as string,
        syncStatus: 'PENDING',
      }

      try {
        if (network.isOnline) {
          newTodo.syncStatus = 'SYNCED'

          await $fetch('/api/todos/create', {
            method: 'POST',
            body: newTodo,
          })
        }

        await rxdbService.db.todos.insert(newTodo)
        return newTodo
      }
      catch (err) {
        console.error('Failed to add todo:', err)
        newTodo.syncStatus = 'FAILED'
        await rxdbService.db.todos.insert(newTodo)
        return newTodo
      }
    },

    toggleTodo: async (id: string) => {
      const todo = await rxdbService.db.todos.findOne(id).exec()
      if (!todo) return

      const updatedTodo = {
        ...todo._data,
        is_completed: !todo._data.is_completed,
        updatedAt: new Date().toISOString(),
        syncStatus: 'DIRTY',
      }

      try {
        if (network.isOnline) {
          updatedTodo.syncStatus = 'SYNCED'

          await $fetch(`/api/todos/${id}/update`, {
            method: 'PATCH',
            body: updatedTodo,
          })
        }

        await todo.update({ $set: updatedTodo })
      }
      catch (err) {
        console.error('Failed to sync toggle to server:', err)
        updatedTodo.syncStatus = 'FAILED'
        await todo.update({ $set: updatedTodo })
      }
    },

    updateTodo: async (item: { name: string, id: string }) => {
      const todo = await rxdbService.db.todos.findOne(item.id).exec()
      if (!todo) return

      const updatedTodo = {
        ...todo._data,
        updatedAt: new Date().toISOString(),
        syncStatus: 'DIRTY',
        name: item.name,
      }

      try {
        if (network.isOnline) {
          updatedTodo.syncStatus = 'SYNCED'

          await $fetch(`/api/todos/${item.id}/update`, {
            method: 'PATCH',
            body: updatedTodo,
          })
        }

        await todo.update({ $set: updatedTodo })
      }
      catch (err) {
        console.error('Failed to sync todo update to server:', err)
        updatedTodo.syncStatus = 'FAILED'
        await todo.update({ $set: updatedTodo })
      }
    },

    deleteTodo: async (id: string) => {
      try {
        await rxdbService.db.todos.findOne(id).remove()

        if (network.isOnline) {
          await $fetch(`/api/todos/${id}/delete`, {
            method: 'DELETE',
          })
        }
      }
      catch (err) {
        console.error('Failed to delete todo:', err)
      }
    },

    getAllTodos: async () => {
      return await rxdbService.db.todos.find().exec()
    },

    syncWithServer: async () => {
      try {
        await rxdbService.syncWithServer()
      }
      catch (err) {
        console.error('Failed to sync with server:', err)
      }
    },
  }
}
