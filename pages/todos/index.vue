<script setup lang="ts">
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import User from '~/components/shared/User.vue'
import AllTodos from '~/components/todos/AllTodos.vue'

definePageMeta({
  middleware: ['authenticated'],
})

useHead({
  title: 'My Todos',
})

const isAddingTodos = ref(false)
const todo = ref('')
const { todos } = useTodos()
const network = reactive(useNetwork())
const hideTodos = ref(false)

const onAddTodos = async () => {
  isAddingTodos.value = true
  try {
    if (!todo.value.trim()) {
      return toast.error('Todo name is required!', {
        position: 'top-center',
      })
    }

    if (todo.value.trim()) {
      await useRxdb().addTodo(todo.value)
      todo.value = ''

      toast.success('Successfully added a todo!', {
        position: 'top-center',
      })
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.log(error)
    toast.error('error on adding todo!', {
      position: 'top-center',
    })
  }
  finally {
    isAddingTodos.value = false
  }
}

const onHideTodos = () => {
  hideTodos.value = !hideTodos.value
}
</script>

<template>
  <section class="max-w-md w-full mx-auto my-4 px-2">
    <h1 class="text-7xl text-red-200 dark:text-primary text-center">
      todos
    </h1>
    <div class="mt-4 flex bg-white items-center space-x-2 border-b shadow-slate-400 dark:shadow shadow-lg">
      <Icon
        v-if="isAddingTodos"
        name="hugeicons:reload"
        class="h-10 w-auto text-gray-400 mx-2 animate-spin"
      />
      <div v-else>
        <ChevronDown
          v-if="hideTodos"
          class="w-6 text-gray-400 mx-2"
          @click="onHideTodos"
        />
        <ChevronUp
          v-else
          class="w-6 text-gray-400 mx-2"
          @click="onHideTodos"
        />
      </div>
      <input
        v-model="todo"
        type="text"
        class="w-full py-3 placeholder:text-zinc-400 placeholder:italic text-2xl bg-transparent border-0 outline-0 text-zinc-500"
        placeholder="What needs to be done?"
        @keyup.enter="onAddTodos"
      >
      <User />
    </div>
    <AllTodos
      v-if="!hideTodos"
      :todos="todos"
    />
    <div class="mt-6 text-center text-sm text-muted-foreground space-y-2">
      <p
        v-if="network.isOnline"
        class="text-green-600 font-medium mt-2"
      >
        You're online - changes will sync with the server
      </p>
      <p
        v-else
        class="text-yellow-600 font-medium mt-2"
      >
        You're offline - changes will sync when you reconnect
      </p>
      <div>
        <p>
          ⚡ Built with <NuxtLink
            to="https://rxdb.info"
            target="_blank"
            class="font-semibold text-emerald-600 hover:text-emerald-400 dark:text-primary hover:underline"
          >RxDB</NuxtLink>, <NuxtLink
            to="https://orm.drizzle.team"
            target="_blank"
            class="font-semibold text-emerald-600 hover:text-emerald-400 dark:text-primary hover:underline"
          >Drizzle ORM</NuxtLink>, <NuxtLink
            to="https://www.postgresql.org"
            target="_blank"
            class="font-semibold text-emerald-600 hover:text-emerald-400 dark:text-primary hover:underline"
          >PostgreSQL</NuxtLink>, and <NuxtLink
            to="https://nuxt.com"
            target="_blank"
            class="font-semibold text-emerald-600 hover:text-emerald-400 dark:text-primary hover:underline"
          >Nuxt.js</NuxtLink>.
        </p>
        <p>
          🎩 Inspired by <NuxtLink
            to="https://github.com/bencodezen/local-first-nuxt-todomvc"
            target="_blank"
            class="font-semibold text-emerald-600 hover:text-emerald-400 dark:text-primary hover:underline"
          >bencodezen</NuxtLink>
        </p>
      </div>
    </div>
  </section>
</template>
