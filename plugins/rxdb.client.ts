// /plugins/rxdb.client.ts
import { rxdbService } from '~/services/rxdb-service'

export default defineNuxtPlugin(async (nuxtApp) => {
  await rxdbService.initDatabase()

  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => rxdbService.syncWithServer())
  }

  nuxtApp.provide('rxdbService', rxdbService)
})
