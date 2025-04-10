import { type InferSelectModel, relations } from 'drizzle-orm'
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const userTable = pgTable(
  'user',
  {
    id: text('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    username: varchar('username', { length: 255 }),
    emailVerified: boolean('email_verified').notNull().default(false),
    profilePictureUrl: text('profile_picture_url'),
    createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', {
      mode: 'date',
      precision: 3,
    }).$onUpdate(() => new Date()),
  },
  table => ({
    emailIndex: index('email_index').on(table.email),
  }),
)

export const todosTable = pgTable('todos', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  is_completed: boolean('is_completed').notNull().default(false),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    precision: 3,
  }).$onUpdate(() => new Date()),
},
table => ({
  name_index: index('name_index').on(table.name),
}),
)

export const sessionTable = pgTable('session', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
})

export const oauthAccountTable = pgTable('oauth_account', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(),
  providerUserId: text('provider_user_id').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    precision: 3,
  }).$onUpdate(() => new Date()),
})

// relations
export const userRelations = relations(userTable, ({ many }) => ({
  todos: many(todosTable),
}))

export const todosRelations = relations(
  todosTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [todosTable.userId],
      references: [userTable.id],
    }),
  }),
)

export type User = InferSelectModel<typeof userTable>
export type Todo = InferSelectModel<typeof todosTable>
export type Session = InferSelectModel<typeof sessionTable>
