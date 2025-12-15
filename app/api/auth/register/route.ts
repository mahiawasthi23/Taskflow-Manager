import { NextResponse } from 'next/server'
import { registerUser, findUserByEmail } from '@/lib/auth'

export async function POST(req: Request) {
    const { name, email, password } = await req.json()

    if (!name || !email || !password)
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const existing = await findUserByEmail(email)
    if (existing)
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })

    const user = await registerUser({ name, email, password, role: 'user' })

    return NextResponse.json({ ok: true, user })
}
