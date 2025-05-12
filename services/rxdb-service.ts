import { createRxDatabase, addRxPlugin } from 'rxdb'
import { getRxStorageLocalstorage } from 'rxdb/plugins/storage-localstorage'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'
import type { Todo } from '~/types'

const todoSchema = {
  title: 'todo schema',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', maxLength: 255 },
    name: { type: 'string' },
    is_completed: { type: 'boolean' },
    user_id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' },
  },
  required: ['id', 'name', 'user_id', 'is_completed', 'createdAt'],
}

class RxdbService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _db: any = null

  async initDatabase() {
    addRxPlugin(RxDBUpdatePlugin)
    addRxPlugin(RxDBDevModePlugin)
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

    const serverTodos = await $fetch<Todo[]>('/api/todos')
    const localTodos = await this._db.todos.find().exec()

    for (const t of serverTodos) {
      const local = localTodos.find((lt: Todo) => lt.id === t.id)
      const serverDate = new Date(t.updatedAt)
      const localDate = new Date(local?.updatedAt ?? 0)

      if (!local) {
        await this._db.todos.insert(t)
      }
      else if (serverDate > localDate) {
        await this._db.todos.upsert(t)
      }
    }
  }
}

export const rxdbService = new RxdbService()
