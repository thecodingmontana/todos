export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)

    if (!session) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const res = await useDrizzle().delete(tables.todos).where(
      and(
        eq(tables.todos.userId, session.user.id),
        eq(tables.todos.is_completed, true),
      ),
    )

    console.log(res)

    return { message: 'You\'ve successfully cleared your completed todos!' }
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
