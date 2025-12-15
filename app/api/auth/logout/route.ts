import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/session'


export async function POST() {
    const headers = new Headers()
    clearSession(headers)
    return new NextResponse(JSON.stringify({ ok: true }), { status: 200, headers })
}