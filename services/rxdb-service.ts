import { createRxDatabase, addRxPlugin } from 'rxdb'
import { getRxStorageLocalstorage } from 'rxdb/plugins/storage-localstorage'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'
// import type { Todo } from '~/types'

const todoSchema = {
  title: 'todo schema',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', maxLength: 255 },
    name: { type: 'string' },
    is_completed: { type: 'boolean' },
    userId: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    syncStatus: { type: 'string' },
  },
  required: ['id', 'name', 'userId', 'is_completed', 'createdAt', 'syncStatus'],
}

class RxdbService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _db: any = null

  async initDatabase() {
    addRxPlugin(RxDBUpdatePlugin)
    addRxPlugin(RxDBQueryBuilderPlugin)

    this._db = await createRxDatabase({
      name: 'todosdb',
      storage: wrappedValidateAjvStorage({
        storage: getRxStorageLocalstorage(),
      }),
    })

    await this._db.addCollections({
      todos: { schema: todoSchema },
    })

    return this._db
  }

  get db() {
    if (!this._db) throw new Error('Database not initialized.')
    return this._db
  }

  async syncWithServer() {
    if (!navigator.onLine || !this._db) return

    const localTodos = await this._db.todos.find().exec()

    for (const local of localTodos) {
      const localTodo = local._data

      const newTodo = {
        ...localTodo,
        updatedAt: new Date().toISOString(),
      }

      try {
        if (localTodo.syncStatus === 'FAILED' || localTodo.syncStatus === 'PENDING') {
          newTodo.syncStatus = 'SYNCED'
          console.log('Creating a todo on server:', newTodo)

          await $fetch('/api/todos/create', {
            method: 'POST',
            body: newTodo,
          })

          await local.update({ $set: newTodo })
        }
        else if (localTodo.syncStatus === 'DIRTY') {
          newTodo.syncStatus = 'SYNCED'
          console.log('Updating a todo on server:', newTodo)

          await $fetch(`/api/todos/${newTodo.id}/update`, {
            method: 'PATCH',
            body: newTodo,
          })

          await local.update({ $set: newTodo })
        }
      }
      catch (err) {
        console.error(`Failed to sync todo "${localTodo.name}" (${localTodo.id}):`, err)

        await local.update({ $set: { syncStatus: 'FAILED' } })
      }
    }
  }
}

export const rxdbService = new RxdbService()
