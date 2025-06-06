export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const todoId = getRouterParam(event, 'todoId')
    const body = await readBody(event) as { name: string, is_completed: boolean, syncStatus: 'PENDING' | 'SYNCED' | 'FAILED' | 'DIRTY' }

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized!',
      })
    }

    if (!todoId || typeof todoId !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'todoId is required!',
      })
    }

    if (!body.name || typeof body.name !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'todo name is required!',
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

    const [todo] = await useDrizzle().update(tables.todos).set({
      name: body.name,
      is_completed: body.is_completed,
      updatedAt: new Date(),
      syncStatus: body.syncStatus,
    }).where(
      and(
        eq(tables.todos.id, todoId),
        eq(tables.todos.userId, session.user.id),
      ),
    ).returning()

    return todo
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    const errorMessage = error ? error.statusMessage : error.message
    throw createError({
      statusCode: error ? error.statusCode : 500,
      statusMessage: `${errorMessage}!`,
    })
  }
})
