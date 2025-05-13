import { ref, onMounted, onUnmounted } from 'vue'
import type { RxDocument, RxQuery } from 'rxdb'
import type { Todo } from '~/types'

export const useTodos = () => {
  const todos = ref<Todo[]>([])
  const subscription = ref<ReturnType<RxQuery<RxDocument<Todo>>['$']['subscribe']> | null>(null)

  const initSubscription = async () => {
    const { db } = useNuxtApp().$rxdbService

    subscription.value = db.todos
      .find()
      .sort({ updatedAt: 'desc' })
      .$ // Observable
      .subscribe((docs: RxDocument<Todo>[]) => {
        todos.value = docs.map(doc => doc.toJSON() as Todo)
      })
  }

  onMounted(() => {
    initSubscription()
  })

  onUnmounted(() => {
    subscription.value?.unsubscribe()
  })

  return {
    todos,
  }
}
