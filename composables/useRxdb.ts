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
      }

      await rxdbService.db.todos.insert(newTodo)

      if (network.isOnline) {
        await $fetch('/api/todos/create', {
          method: 'POST',
          body: newTodo,
        })
      }

      return newTodo
    },

    toggleTodo: async (id: string) => {
      const todo = await rxdbService.db.todos.findOne(id).exec()

      if (todo) {
        await todo.update({
          $set: {
            is_completed: !todo.is_completed,
            updatedAt: new Date().toISOString(),
          },
        })

        if (network.isOnline) {
          await $fetch(`/api/todos/${id}/update`, {
            method: 'PATCH',
            body: todo._data,
          })
        }
      }
    },

    deleteTodo: async (id: string) => {
      await rxdbService.db.todos.findOne(id).remove()

      if (network.isOnline) {
        await $fetch(`/api/todos/${id}/delete`, {
          method: 'DELETE',
        })
      }
    },

    getAllTodos: async () => {
      return await rxdbService.db.todos.find().exec()
    },

    syncWithServer: async () => {
      await rxdbService.syncWithServer()
    },
  }
}
