<script setup lang="ts">
import { ArrowBigDownIcon, ChevronDown, ChevronUp } from 'lucide-vue-next'

definePageMeta({
  middleware: ['authenticated'],
})

useHead({
  title: 'My Todos',
})

const store = useStore()

const { data } = await store.todos?.queryMany()

const isAddingTodos = ref(false)
const todo = ref('')
const hideTodos = ref(false)

const onAddTodos = async () => {

}

const onHideTodos = () => {
  hideTodos.value = !hideTodos.value
}
</script>

<template>
  <section class="max-w-3xl w-full mx-auto my-4">
    <h1 class="text-7xl text-red-200 dark:text-primary text-center">
      todos
    </h1>
    <div class="mt-4 flex bg-white items-center space-x-2 border-b shadow-slate-400 dark:shadow shadow-lg">
      <ArrowBigDownIcon
        v-if="isAddingTodos"
        class="w-6 text-gray-400 mx-2 animate-spin"
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
        class="w-full py-3 placeholder:text-gray-300 placeholder:italic text-2xl bg-transparent border-0 outline-0"
        placeholder="What needs to be done?"
        @keyup.enter="onAddTodos"
      >
    </div>
    <!-- <Todos v-if="!hideTodos" /> -->
  </section>
</template>
