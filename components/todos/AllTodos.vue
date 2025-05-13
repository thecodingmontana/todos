<script setup lang="ts">
import Todo from './Todo.vue'
import { cn } from '~/lib/utils'
import type { Todo as ITodo } from '~/types'

const props = defineProps<{
  todos: ITodo[]
}>()

const uiState = ref<'completed' | 'active' | 'all'>('all')

const displayedTodoList = computed(() => {
  return props.todos.filter((todo) => {
    if (uiState.value === 'all') return true
    if (uiState.value === 'active') return !todo.is_completed
    if (uiState.value === 'completed') return todo.is_completed
    return false
  })
})

const noOfTodosIncompleted = computed(() => {
  return displayedTodoList.value.filter(todo => !todo.is_completed).length
})

const onViewAllTasks = () => {
  uiState.value = 'all'
}

const onViewAllActiveTasks = () => {
  uiState.value = 'active'
}

const onClearCompletedTodos = async () => {
  await useRxdb().removeCompletedTodos()
}

const onViewCompletedTasks = () => {
  uiState.value = 'completed'
}
</script>

<template>
  <div>
    <div v-if="displayedTodoList.length > 0">
      <Todo
        v-for="todo in displayedTodoList"
        :key="todo.id"
        :todo="todo"
      />
    </div>
    <div
      v-else
      class="py-3 bg-white px-4 group border-b shadow-slate-400 shadow-lg"
    >
      <p class="text-center text-zinc-500">
        No todos
      </p>
    </div>
    <div
      class="bg-white p-2 border-b shadow-slate-400 shadow-lg flex justify-between text-xs sm:text-sm items-center text-gray-500"
    >
      <button>{{ noOfTodosIncompleted > 1 ? `${noOfTodosIncompleted} items`: `${noOfTodosIncompleted} item` }} left</button>
      <div class="flex space-x-2 justify-between">
        <button
          :class="cn(
            'cursor-pointer',
            uiState == 'all' ? 'hover:border-emerald-600 text-emerald-600 border-b border-emerald-600' : 'hover:border-emerald-300 hover:border-b',
          )"
          @click="onViewAllTasks"
        >
          All
        </button>
        <button
          :class="cn(
            'cursor-pointer',
            uiState == 'active' ? 'hover:border-emerald-600 text-emerald-600 border-b border-emerald-600' : 'hover:border-emerald-300 hover:border-b',
          )"
          @click="onViewAllActiveTasks"
        >
          Active
        </button>
        <button
          :class="cn(
            'cursor-pointer',
            uiState == 'completed' ? 'hover:border-emerald-600 text-emerald-600 border-b border-emerald-600' : 'hover:border-emerald-300 hover:border-b',
          )"
          @click="onViewCompletedTasks"
        >
          Completed
        </button>
      </div>
      <button
        class="cursor-pointer hover:underline"
        @click="onClearCompletedTodos"
      >
        Clear completed
      </button>
    </div>
    <div class="mx-1">
      <div class="w-full bg-white py-0.5 border-b shadow-slate-400 shadow-lg" />
      <div class="mx-1">
        <div class="w-full bg-white py-0.5 border-b shadow-slate-400 shadow-lg" />
      </div>
    </div>
  </div>
</template>
