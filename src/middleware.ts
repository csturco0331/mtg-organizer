import { NextRequest, NextResponse } from "next/server"
import { updateSession } from "./app/lib/session"

export async function middleware(req: NextRequest) {
    console.log('Middleware request:', req.nextUrl.pathname)
    if (req.nextUrl.pathname.startsWith('/api')) {
        return
    }
    if (req.nextUrl.pathname.startsWith('/sign')) {
        return
    }
    console.log("Middleware ran")
    let res = await updateSession(req)
    if (!res) { //session not found
        return NextResponse.redirect(new URL('/signIn', req.url))
    }
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
      '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}  