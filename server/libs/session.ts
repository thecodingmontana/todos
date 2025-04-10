import { sha256 } from '@oslojs/crypto/sha2'
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from '@oslojs/encoding'
import { eq } from 'drizzle-orm'
import type { Session as DBSession } from './../database/schema'
import { tables, useDrizzle } from '~/server/utils/drizzle'
import type { User } from '~/types'

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

  const result = await useDrizzle()
    .select({
      sessionId: tables.session.id,
      userId: tables.session.userId,
      expiresAt: tables.session.expiresAt,
      userEmail: tables.user.email,
      username: tables.user.username,
      avatar: tables.user.avatar,
    })
    .from(tables.session)
    .innerJoin(
      tables.user,
      eq(tables.session.userId, tables.user.id),
    )
    .where(eq(tables.session.id, sessionId))
    .limit(1)

  if (result.length === 0) {
    return { session: null, user: null }
  }

  const row = result[0]
  const session: Session = {
    id: row.sessionId,
    userId: row.userId,
    expiresAt: row.expiresAt,
  }
  const user: User = {
    id: row.userId,
    email: row.userEmail,
    username: row.username,
    avatar: row.avatar,
  }

  if (Date.now() >= session.expiresAt.getTime()) {
    await useDrizzle()
      .delete(tables.session)
      .where(eq(tables.session.id, sessionId))
    return { session: null, user: null }
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    await useDrizzle()
      .update(tables.session)
      .set({ expiresAt: session.expiresAt })
      .where(eq(tables.session.id, sessionId))
  }

  return { session, user }
}

export async function invalidateSession(sessionToken: string): Promise<void> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)))
  await useDrizzle()
    .delete(tables.session)
    .where(eq(tables.session.id, sessionId))
}

export async function invalidateUserSessions(userId: string): Promise<void> {
  await useDrizzle()
    .delete(tables.session)
    .where(eq(tables.session.userId, userId))
}

export async function getUserSessions(userId: string): Promise<DBSession[]> {
  const sessions = await useDrizzle().query.session.findMany({
    where: table => eq(table.userId, userId),
  })
  return sessions
}

export function generateSessionToken(): string {
  const tokenBytes = new Uint8Array(20)
  crypto.getRandomValues(tokenBytes)
  const token = encodeBase32LowerCaseNoPadding(tokenBytes)
  return token
}

export async function createSession(
  token: string,
  userId: string,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  }

  await useDrizzle()
    .insert(tables.session)
    .values({
      id: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt,
    })
    .returning()
  return session
}

export interface Session {
  id: string
  expiresAt: Date
  userId: string
}

type SessionValidationResult =
  | { session: Session, user: User }
  | { session: null, user: null }
