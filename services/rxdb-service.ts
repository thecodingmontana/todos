import type { RxDatabase, RxCollection } from 'rxdb'
import { createRxDatabase, addRxPlugin } from 'rxdb'
import { getRxStorageLocalstorage } from 'rxdb/plugins/storage-localstorage'
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
    userId: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
    syncStatus: { type: 'string' },
  },
  required: ['id', 'name', 'userId', 'is_completed', 'createdAt', 'syncStatus'],
}

type TodoDocType = Todo
type TodoCollection = RxCollection<TodoDocType>

interface DatabaseCollections {
  todos: TodoCollection
}

class RxdbService {
  private _db: RxDatabase<DatabaseCollections> | null = null

  async initDatabase() {
    addRxPlugin(RxDBUpdatePlugin)
    addRxPlugin(RxDBQueryBuilderPlugin)

    this._db = await createRxDatabase<DatabaseCollections>({
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
    const serverTodos = await $fetch<Todo[]>('/api/todos')

    const localMap = new Map(localTodos.map(t => [t._data.id, t]))
    const serverMap = new Map(serverTodos.map(t => [t.id, t]))

    // 1. PUSH LOCAL → SERVER if not present
    for (const local of localTodos) {
      const localTodo = local._data
      const existsOnServer = serverMap.has(localTodo.id)

      if (!existsOnServer) {
        try {
          const created = await $fetch<Todo>('/api/todos/create', {
            method: 'POST',
            body: { ...localTodo, syncStatus: 'SYNCED' },
          })

          await local.remove()
          await this._db.todos.insert({ ...created, syncStatus: 'SYNCED' })
        }
        catch (err) {
          console.error(`Failed to push local-only todo: ${localTodo.name}`, err)
          await local.update({ $set: { syncStatus: 'FAILED' } })
        }
      }
    }

    // 2. UPDATE DIRTY LOCAL TODOS on server
    for (const local of localTodos) {
      const localTodo = local._data
      if (localTodo.syncStatus === 'DIRTY') {
        try {
          await $fetch(`/api/todos/${localTodo.id}/update`, {
            method: 'PATCH',
            body: { ...localTodo, syncStatus: 'SYNCED' },
          })

          await local.update({ $set: { syncStatus: 'SYNCED' } })
        }
        catch (err) {
          console.error(`Failed to update dirty todo: ${localTodo.name}`, err)
          await local.update({ $set: { syncStatus: 'FAILED' } })
        }
      }
    }

    // 3. ADD SERVER → LOCAL if not present
    for (const serverTodo of serverTodos) {
      const local = localMap.get(serverTodo.id)
      if (!local) {
        await this._db.todos.insert({ ...serverTodo, syncStatus: 'SYNCED' })
      }
      else {
        const localTodo = local._data
        if (new Date(serverTodo.updatedAt) > new Date(localTodo.updatedAt)) {
          await local.update({ $set: { ...serverTodo, syncStatus: 'SYNCED' } })
        }
      }
    }

    // 4. DELETE SERVER TODOS that are no longer in local
    for (const serverTodo of serverTodos) {
      if (!localMap.has(serverTodo.id)) {
        try {
          await $fetch(`/api/todos/${serverTodo.id}/delete`, { method: 'DELETE' })
          console.log(`Deleted server-only todo "${serverTodo.name}"`)
        }
        catch (err) {
          console.error(`Failed to delete server-only todo "${serverTodo.name}":`, err)
        }
      }
    }
  }
}

export const rxdbService = new RxdbService()
