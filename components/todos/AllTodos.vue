<script setup lang="ts"></script>

<template>
  <div>
    <div v-if="todos.length > 0">
      <Todo
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
      />
    </div>
    <div
      class="bg-white p-2 border-b shadow-slate-400 shadow-lg flex justify-between text-xs sm:text-sm items-center text-gray-500"
    >
      <button>{{ noOfTasksIncompleted }} item left</button>
      <div class="flex space-x-2 justify-between">
        <button
          :class="uiState == 'all' ? 'p-0.5 hover:border-red-600 border border-red-300 rounded' : 'p-0.5 hover:border-red-300 hover:border rounded'"
          @click="allTasks"
        >
          All
        </button>
        <button
          :class="uiState == 'active' ? 'p-0.5 hover:border-red-600 border border-red-300 rounded' : 'p-0.5 hover:border-red-300 hover:border rounded'"
          @click="tasksActive"
        >
          Active
        </button>
        <button
          :class="uiState == 'completed' ? 'p-0.5 hover:border-red-600 border border-red-300 rounded' : 'p-0.5 hover:border-red-300 hover:border rounded'"
          @click="taskCompleted"
        >
          Completed
        </button>
      </div>
    </div>
    <div class="mx-1">
      <div class="w-full bg-white py-0.5 border-b shadow-slate-400 shadow-lg" />
      <div class="mx-1">
        <div class="w-full bg-white py-0.5 border-b shadow-slate-400 shadow-lg" />
      </div>
    </div>
  </div>
</template>
