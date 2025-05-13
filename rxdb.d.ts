import type { RxdbService } from '~/plugins/rxdb-setup'

declare module '#app' {
  interface NuxtApp {
    $rxdbService: RxdbService
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $rxdbService: RxdbService
  }
}
