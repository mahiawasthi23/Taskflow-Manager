import bcrypt from 'bcryptjs'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'


export async function hashPassword(pw: string) {
    return bcrypt.hash(pw, 10)
}


export async function registerUser({ name, email, password, role = 'user' }: { name: string, email: string, password: string, role?: string }) {
    const hashed = await hashPassword(password)
    const res = await db.insert(users).values({ name, email, password: hashed, role }).returning()
    return res[0]
}


export async function findUserByEmail(email: string) {
    const u = await db.select().from(users).where(eq(users.email, email)).limit(1)
    return u[0] ?? null
}


export async function verifyPassword(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed)
}


export async function updateUserProfile(id: number, payload: { name?: string, email?: string, password?: string }) {
    const toUpdate: any = {}
    if (payload.name) toUpdate.name = payload.name
    if (payload.email) toUpdate.email = payload.email
    if (payload.password) toUpdate.password = await hashPassword(payload.password)
    await db.update(users).set(toUpdate).where(eq(users.id, id))
    return await db.select().from(users).where(eq(users.id, id)).limit(1)
}