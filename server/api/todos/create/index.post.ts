import { v4 as uuidv4 } from 'uuid'

export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event)
    const body = await readBody(event) as { name: string }

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

    const [todo] = await useDrizzle().insert(tables.todos).values({
      id: uuidv4(),
      name: body.name,
      userId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

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
