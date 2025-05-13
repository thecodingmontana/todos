export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    // get all todos
    const todos = await useDrizzle().query.todos.findMany({
      where: table => eq(table.userId, session.user.id),
    })

    return todos
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    throw createError({
      message: `Failed to get user todos: ${error.message}`,
      statusCode: error.statusCode ? error.statusCode : 500,
    })
  }
})
