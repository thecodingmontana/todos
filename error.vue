<script setup lang="ts">
import Footer from './components/shared/Footer.vue'
import { Button } from './components/ui/button'
import type { NuxtError } from '#app'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  error: Object as () => NuxtError,
})

const handleError = () => clearError({ redirect: '/' })

const { $gsap } = useNuxtApp()

let timeline: gsap.core.Timeline | null = null

onMounted(async () => {
  await nextTick()

  timeline = $gsap.timeline({ paused: true })

  timeline
    .fromTo(
      '.animate-error-scaleIn',
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2.5, ease: 'power4.out', delay: 0.3 },
    )
    .fromTo(
      '.animate-error-title',
      { opacity: 0, y: 20 },
      { opacity: 1, duration: 1.8, y: 0, ease: 'power2.out' },
      '-=2',
    )
    .fromTo(
      '.animate-error-info',
      { opacity: 0, y: 20 },
      { opacity: 1, duration: 1.5, y: 0, ease: 'power2.out' },
      '-=1.5',
    )
    .fromTo(
      '.animate-error-button',
      { opacity: 0, y: 20 },
      { opacity: 1, duration: 1.5, y: 0, ease: 'power2.out' },
      '-=1',
    )

  timeline.play()
})

onUnmounted(() => {
  timeline?.kill()
})
</script>

<template>
  <main class="mx-auto flex min-h-screen flex-col overflow-hidden dark:bg-neutral-900 xl:overflow-visible">
    <ClientOnly>
      <section class="grid flex-1 place-content-center">
        <div v-if="error?.statusCode === 500">
          <h2>{{ error?.statusCode ?? 'Unknown Error' }}</h2>
          {{ error }}
          <button @click="handleError">
            Clear errors
          </button>
        </div>
        <div
          v-if="error?.statusCode === 404"
          class="flex flex-col items-center gap-5"
        >
          <h2 class="animate-error-title text-3xl font-semibold md:text-4xl xl:text-5xl">
            OOPS!
          </h2>
          <Svgs404Error class="animate-error-scaleIn h-auto w-80 sm:w-[25rem] md:w-[35rem] xl:w-[40rem]" />
          <div class="flex flex-col items-center gap-2">
            <p class="animate-error-info max-w-md text-center text-base text-muted-foreground md:text-xl xl:text-2xl">
              We can't seem to find the page you're looking for.
            </p>
            <Button
              class="animate-error-button group flex w-fit items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-all hover:bg-brand-secondary md:text-base"
              @click="handleError"
            >
              <Icon
                name="solar:arrow-right-outline"
                class="size-5 rotate-[-135deg] transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
              />
              Return Home
            </Button>
          </div>
        </div>
      </section>
    </ClientOnly>
    <Footer />
  </main>
</template>
