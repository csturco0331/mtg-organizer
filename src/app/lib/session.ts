import {SignJWT, jwtVerify} from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { User } from './modals/user'
 
const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)
const SESSIONTIMEOUT = 6 * 60 * 60 * 1000 //6 hours

type Payload = {
  user: User,
  expiresAt: Date,
  iat: Number,
  exp: Number,
  expires: Date
}

async function encrypt(payload: { user: User, expiresAt: Date}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('6h')
    .sign(encodedKey)
}
 
async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify<Payload>(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as Payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}
 
export async function createSession(user: User) {
  const expiresAt = new Date(Date.now() + SESSIONTIMEOUT)
  const session = await encrypt({ user, expiresAt })
 
  setCookie(session, expiresAt)
}

export async function getSessionUser() {
  const session = cookies().get('session')?.value
  const payload = await decrypt(session)
  return payload?.user
}

export function getSession() {
  return cookies().get('session')?.value
}

export async function updateSession(session: string) {
  if (!session) return
  const payload = await decrypt(session)
  if (!payload) return
  let expiration = new Date(Date.now() + SESSIONTIMEOUT)
  payload.expires = expiration
  const res = NextResponse.next()
  res.cookies.set({
    name: 'session',
    value: await encrypt(payload),
    expires: expiration,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })
  return res
}

export async function deleteSession() {
  cookies().delete('session')
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