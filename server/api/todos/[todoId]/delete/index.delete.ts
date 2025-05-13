export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const todoId = getRouterParam(event, 'todoId')

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

    await useDrizzle().delete(tables.todos).where(
      and(
        eq(tables.todos.id, todoId),
        eq(tables.todos.userId, session.user.id),
      ),
    )

    return {
      message: 'Todo was successfully deleted!',
    }
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
