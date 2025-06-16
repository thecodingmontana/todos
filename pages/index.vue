<script setup lang="ts">
import { Button } from '~/components/ui/button'

const { loggedIn } = useUserSession()

watch(() => loggedIn.value, (loggedIn) => {
  if (loggedIn) {
    navigateTo('/todos')
  }
}, {
  immediate: true,
})

const onSigninWith = (provider: 'github') => {
  window.location.href = `/api/auth/signin/${provider}`
}

defineOgImageComponent('Nuxt', {
  headline: 'Greetings 👋',
  title: 'Local First Todos',
  description: 'Welcome to Local First Todos by @codewithmontana',
})
</script>

<template>
  <div class="flex flex-col max-w-xl w-full items-center gap-3 px-4">
    <h1 class="text-2xl lg:text-3xl font-medium text-center">
      Welcome to Local First Todos by <br>
      <NuxtLink
        to="https://x.com/codewithmontana"
        target="_blank"
        class="font-semibold text-emerald-600 hover:text-emerald-400 dark:text-primary"
      >@codewithmontana</NuxtLink>.
    </h1>
    <div class="grid gap-3">
      <div class="grid gap-2">
        <p class="max-w-lg text-center text-muted-foreground">
          This is a simple Nuxt 3 ToDo app that demonstrates local-first caching and offline
          support using
          <NuxtLink
            to="https://rxdb.info"
            target="_blank"
            class="font-semibold text-emerald-600 hover:text-emerald-400 dark:text-primary"
          >RxDB</NuxtLink>
          package. Built to ensure a seamless offline experience.
        </p>
        <p class="text-center text-muted-foreground">
          Let's get started by:
        </p>
        <div class="flex flex-col items-center">
          <Button
            class="w-fit"
            @click="onSigninWith('github')"
          >
            <Icon
              name="akar-icons:github-fill"
              class="size-5"
            />
            Signin with GitHub
          </Button>
        </div>
      </div>
      <div>
        <h2 class="text-lg">
          Stack
        </h2>
        <ul class="ml-6 list-disc [&>li]:mt-2 text-muted-foreground">
          <li>
            <span
              class="font-semibold text-emerald-600 hover:text-emerald-400 dark:text-primary"
            >Nuxt 3</span>
            deals with frontend and backend.
          </li>
          <li>
            <span
              class="font-semibold text-emerald-600 hover:text-emerald-400 dark:text-primary"
            >RxDB</span>
            a NoSQL client-side database, to store todos locally.
          </li>
          <li>
            <span
              class="font-semibold text-emerald-600 hover:text-emerald-400 dark:text-primary"
            >PostgreSQL</span>
            as a server side database.
          </li>
          <li>
            <span
              class="font-semibold text-emerald-600 hover:text-emerald-400 dark:text-primary"
            >Drizzle ORM</span>
            as an ORM, migrator and query builder.
          </li>
          <li>
            <span
              class="font-semibold text-emerald-600 hover:text-emerald-400 dark:text-primary"
            >Nuxt Auth Utils</span>
            for the authentication layer.
          </li>
          <li>
            <span
              class="font-semibold text-emerald-600 hover:text-emerald-400 dark:text-primary"
            >Shadcn (TailwindCSS v4)</span>
            for styles and components.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
