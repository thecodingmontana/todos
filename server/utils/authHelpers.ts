import type { H3Event } from 'h3'
import { and, eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import type { User } from '../database/schema'
import { createSession, generateSessionToken } from '../libs/session'

interface AuthenticateOauthUserOptions {
  providerName: 'github'
  providerUserEmail: string
  providerUsername: string
  providerUserId: string
  providerAvatar: string
}

export async function authenticateOauthUser(options: AuthenticateOauthUserOptions, event: H3Event) {
  // check if user exists in the database
  const existingUser = await useDrizzle().query.user.findFirst({
    where: table => eq(table.email, options.providerUserEmail),
  })

  if (existingUser) {
    // check if the user has an existing oauth account
    const existingOauthAccount = await useDrizzle().query.oauth_account.findFirst({
      where: table => and(
        eq(table.providerUserId, options.providerUserId),
        eq(table.provider, options.providerName),
      ),
    })
    if (!existingOauthAccount) {
      // if the user already exists, create an oauth account with the options
      await createOauthAccount(options, existingUser.id)
    }
    // Create session token and store in database

    const sessionToken = generateSessionToken()
    const session = await createSession(sessionToken, existingUser.id)

    // Set user session with token
    await setUserSession(event, {
      user: {
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
        avatar: existingUser.avatar,
      },
      sessionToken: sessionToken,
    }, {
      maxAge: Math.floor((session.expiresAt.getTime() - Date.now()) / 1000), // Convert milliseconds to seconds
    })
  }
  else {
    const user = await createUser(options)
    await createOauthAccount(options, user.id)

    // Create session token and store in database

    const sessionToken = generateSessionToken()
    const session = await createSession(sessionToken, user.id)

    // Set user session with token
    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
      },
      sessionToken: sessionToken,
    }, {
      maxAge: Math.floor((session.expiresAt.getTime() - Date.now()) / 1000), // Convert milliseconds to seconds
    })
  }
}

export async function createOauthAccount(options: AuthenticateOauthUserOptions, userId: string) {
  await useDrizzle().insert(tables.oauth_account).values({
    id: uuidv4(),
    provider: options.providerName,
    providerUserId: options.providerUserId,
    userId: userId,
  })
}

export async function createUser(options: AuthenticateOauthUserOptions): Promise<User> {
  const [newUser] = await useDrizzle()
    .insert(tables.user)
    .values({
      email: options.providerUserEmail,
      id: uuidv4(),
      username: options.providerUsername,
      avatar: options.providerAvatar,
    })
    .returning()

  return newUser
}
