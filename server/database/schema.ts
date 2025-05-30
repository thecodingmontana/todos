import { type InferSelectModel, relations } from 'drizzle-orm'
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const syncStatusEnum = pgEnum('syncStatusEnum', [
  'PENDING',
  'SYNCED',
  'FAILED',
  'DIRTY',
])

export const user = pgTable(
  'user',
  {
    id: text('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    username: varchar('username', { length: 255 }).notNull(),
    avatar: text('avatar').notNull(),
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

export const todos = pgTable('todos', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  is_completed: boolean('is_completed').notNull().default(false),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  syncStatus: syncStatusEnum('syncStatus').notNull().default('PENDING'),
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

export const session = pgTable('session', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
})

export const oauth_account = pgTable('oauth_account', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
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

export const cronJobTable = pgTable('cron_jobs', {
  id: text('id').notNull(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
})

// relations
export const userRelations = relations(user, ({ many }) => ({
  todos: many(todos),
}))

export const todosRelations = relations(
  todos,
  ({ one }) => ({
    user: one(user, {
      fields: [todos.userId],
      references: [user.id],
    }),
  }),
)

export type User = InferSelectModel<typeof user>
export type Todo = InferSelectModel<typeof todos>
export type Session = InferSelectModel<typeof session>
