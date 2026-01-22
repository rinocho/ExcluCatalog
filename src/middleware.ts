import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('auth_token')
    const { pathname } = request.nextUrl

    // Protect /catalogo route
    if (pathname.startsWith('/catalogo')) {
        if (!authCookie) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // Redirect logged in users from /login to /catalogo
    if (pathname === '/login') {
        if (authCookie) {
            return NextResponse.redirect(new URL('/catalogo', request.url))
        }
    }

    // Redirect root to /login (or /catalogo if logged in)
    if (pathname === '/') {
        if (authCookie) {
            return NextResponse.redirect(new URL('/catalogo', request.url))
        } else {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/login', '/catalogo/:path*'],
}
