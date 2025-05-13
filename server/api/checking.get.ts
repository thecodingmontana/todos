import { v4 as uuidv4 } from 'uuid'

export default defineEventHandler(async () => {
  try {
    await useDrizzle()
      .insert(tables.cronJobTable)
      .values({
        id: uuidv4(),
      })
  }
  catch (error) {
    console.log('cron job error', error)
  }
})
