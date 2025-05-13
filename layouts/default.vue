<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import Footer from '~/components/shared/Footer.vue'

useHead({
  meta: [
    { property: 'og:title', content: `Todos` },
    {
      name: 'description',
      content:
        'A local-first todo app using RxDB, Drizzle ORM, and Nuxt.js. Built for seamless offline experience.',
    },
    {
      property: 'og:description',
      content:
        'A local-first todo app using RxDB, Drizzle ORM, and Nuxt.js. Built for seamless offline experience.',
    },
    {
      property: 'og:url',
      content:
        'A local-first todo app using RxDB, Drizzle ORM, and Nuxt.js. Built for seamless offline experience.',
    },
    {
      name: 'twitter:title',
      content:
        'A local-first todo app using RxDB, Drizzle ORM, and Nuxt.js. Built for seamless offline experience.',
    },
    {
      name: 'twitter:description',
      content:
        'A local-first todo app using RxDB, Drizzle ORM, and Nuxt.js. Built for seamless offline experience.',
    },
    {
      name: 'twitter:site',
      content:
        'A local-first todo app using RxDB, Drizzle ORM, and Nuxt.js. Built for seamless offline experience.',
    },
  ],
  title: `Local First Todos`,
})
</script>

<template>
  <main
    class="mx-auto flex min-h-screen flex-col overflow-hidden dark:bg-neutral-900 xl:overflow-visible"
  >
    <Toaster
      :close-button="true"
      rich-colors
    />
    <div class="flex-1 grid place-content-center">
      <slot />
    </div>
    <Footer />
  </main>
</template>
