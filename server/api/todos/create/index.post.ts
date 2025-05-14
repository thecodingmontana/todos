export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const body = await readBody(event) as { name: string, syncStatus: 'PENDING' | 'SYNCED' | 'FAILED' | 'DIRTY', id: string, is_completed: boolean }

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized!',
      })
    }

    if (!body.name || typeof body.name !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'todo name is required!',
      })
    }

    if (!body.id || typeof body.id !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'todo id is required!',
      })
    }

    if (typeof body.is_completed !== 'boolean') {
      throw createError({
        statusCode: 400,
        statusMessage: 'is_completed is required and must be a boolean!',
      })
    }

    if (!body.syncStatus || !['PENDING', 'SYNCED', 'FAILED', 'DIRTY'].includes(body.syncStatus)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid syncStatus!',
      })
    }

    const [todo] = await useDrizzle().insert(tables.todos).values({
      id: body.id,
      name: body.name,
      userId: session.user.id,
      syncStatus: body.syncStatus,
      is_completed: body.is_completed,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    return todo
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.log(error)
    const errorMessage = error ? error.statusMessage : error.message
    throw createError({
      statusCode: error ? error.statusCode : 500,
      statusMessage: `${errorMessage}!`,
    })
  }
})
