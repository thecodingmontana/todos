<script setup lang="ts">
import { XIcon } from 'lucide-vue-next'
import { Button } from '../ui/button'
import type { Todo } from '~/types'
import { Checkbox } from '~/components/ui/checkbox'
import { cn } from '~/lib/utils'

const props = defineProps<{
  todo: Todo
}>()

const updateTodoName = async (ev: KeyboardEvent) => {
  const newName: string = (ev.target as HTMLLabelElement).textContent || ''
  await useRxdb().updateTodo({
    id: props?.todo.id,
    name: newName,
  })
}

const toggleTodo = async () => {
  await useRxdb().toggleTodo(props?.todo.id)
}

const deleteTodo = async () => {
  await useRxdb().deleteTodo(props?.todo.id)
}
</script>

<template>
  <div class="py-3 bg-white px-4 group border-b shadow-slate-400 shadow-lg">
    <div class="relative flex items-center w-full self-start">
      <div class="flex items-center gap-x-2">
        <Checkbox
          class="rounded-full size-6 data-[state=checked]:bg-transparent data-[state=checked]:border-emerald-500 data-[state=checked]:text-emerald-500"
          :model-value="props?.todo.is_completed"
          @update:model-value="toggleTodo"
        />
        <label
          contenteditable="true"
          :class="cn(
            'w-full py-3 placeholder:text-zinc-400 placeholder:italic bg-transparent border-0 outline-0',
            todo.is_completed ? 'line-through text-green-600': 'text-zinc-600',
          )"
          @keyup.enter="updateTodoName"
        >
          {{ props?.todo.name }}
        </label>
      </div>
      <Button
        class="rounded-full absolute self-center hidden group-hover:flex right-0 dark:hover:bg-zinc-100 cursor-pointer"
        variant="ghost"
        size="icon"
        @click="deleteTodo"
      >
        <XIcon class="w-5 text-rose-600 hover:text-rose-500" />
      </Button>
    </div>
  </div>
</template>
