import {SignJWT, jwtVerify} from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'
 
const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)
const SESSIONTIMEOUT = 6 * 60 * 60 * 1000 //6 hours
 
type User = {
    _id: string,
    username: string,
    email: string,
}

async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('6h')
    .sign(encodedKey)
}
 
async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}
 
export async function createSession(user: User) {
  const expiresAt = new Date(Date.now() + SESSIONTIMEOUT)
  const session = await encrypt({ user, expiresAt })
 
  setCookie(session, expiresAt)
}

export async function getSession() {
  const session = cookies().get('session')?.value
  const payload = await decrypt(session)
  if (!session || !payload) {
    redirect('/signIn')
  }
  return payload
}

export async function updateSession(req: NextRequest) {
  const session = cookies().get('session')?.value
  if (!session) return
  const payload = await decrypt(session)
  if (!payload) return
  payload.expires = new Date(Date.now() + SESSIONTIMEOUT)
  const res = NextResponse.next()
  res.cookies.set({
    name: 'session',
    value: await encrypt(payload),
    httpOnly: true,
    expires: payload.expires
  })
  return res
}

export async function deleteSession() {
  cookies().delete('session')
  redirect('/')
}

const setCookie = (session: string, date: Date) => {
  return cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: date,
    sameSite: 'lax',
    path: '/',
  })
}