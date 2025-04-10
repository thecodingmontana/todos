<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import Footer from '~/components/shared/Footer.vue'

useHead({
  meta: [
    { property: 'og:title', content: `Todos` },
    {
      name: 'description',
      content:
        'Nuxt 3 todo app with local-first caching and offline support using directus rstore package. Built for seamless offline experience.',
    },
    {
      property: 'og:description',
      content:
        'Nuxt 3 todo app with local-first caching and offline support using directus rstore package. Built for seamless offline experience.',
    },
    {
      property: 'og:url',
      content:
        'Nuxt 3 todo app with local-first caching and offline support using directus rstore package. Built for seamless offline experience.',
    },
    {
      name: 'twitter:title',
      content:
        'Nuxt 3 todo app with local-first caching and offline support using directus rstore package. Built for seamless offline experience.',
    },
    {
      name: 'twitter:description',
      content:
        'Nuxt 3 todo app with local-first caching and offline support using directus rstore package. Built for seamless offline experience.',
    },
    {
      name: 'twitter:site',
      content:
        'Nuxt 3 todo app with local-first caching and offline support using directus rstore package. Built for seamless offline experience.',
    },
  ],
  title: `Todos`,
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
