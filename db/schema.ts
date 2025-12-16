import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core'


export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    role: varchar('role', { length: 20 }).default('user').notNull(),
    address: text('address'),
    gender: varchar('gender', { length: 50 }),
    mobile: varchar('mobile', { length: 20 }),
    created_at: timestamp('created_at').defaultNow().notNull()
})


export const tasks = pgTable('tasks', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    status: varchar('status', { length: 50 }).default('pending').notNull(),
    progress: integer('progress').default(0).notNull(),
    assigned_to: integer('assigned_to'),
    created_by: integer('created_by'),
    due_date: timestamp('due_date'),
    created_at: timestamp('created_at').defaultNow().notNull()
})