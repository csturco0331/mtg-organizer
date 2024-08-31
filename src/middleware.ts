import { NextRequest, NextResponse } from "next/server"
import { getSession, updateSession } from "./app/lib/session"

export async function middleware(req: NextRequest) {
    console.log('Middleware request:', req.nextUrl.pathname)
    let session = req.cookies?.get('session')?.value ?? ''
    if (req.nextUrl.pathname.startsWith('/sign')) return
    let res = await updateSession(session)
    if (!res) //session not found
        return NextResponse.redirect(new URL('/signIn', req.url))
    // if (req.nextUrl.pathname.startsWith('/api')) {
    //     return
    // }
    if (req.nextUrl.pathname === '/')
        return NextResponse.redirect(new URL('/dashboard', req.url))

    return res
}

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico, sitemap.xml, robots.txt (metadata files)
       */
      '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}  