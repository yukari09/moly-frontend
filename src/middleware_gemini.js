// middleware.js
import { withAuth } from "next-auth/middleware"
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

function getPathnameWithoutLocale(pathname, locales) {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.replace(`/${locale}`, '')
    }
    if (pathname === `/${locale}`) {
      return '/'
    }
  }
  return pathname
}

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req)
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // If there's no token, the user is not logged in, deny access.
        if (token == null) {
          return false
        }

        // Get the path without the locale.
        const pathnameWithoutLocale = getPathnameWithoutLocale(
          req.nextUrl.pathname,
          routing.locales
        )
        
        // Check if the user is trying to access the admin area.
        if (pathnameWithoutLocale.startsWith('/admin')) {
          // If so, check if their roles array includes 'admin'.
          // The token.roles comes from the JWT callback in your NextAuth route.
          return token.roles && token.roles.includes('admin')
        }

        // For any other protected path, if the user is logged in (token exists), allow access.
        return true
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

export default function middleware(request) {
  const { pathname } = request.nextUrl
  const { locales } = routing

  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname, locales)
  
  const protectedPaths = [
    '/dashboard', 
    '/profile', 
    '/admin', 
    '/settings'
  ]

  const isProtectedPath = protectedPaths.some(path => 
    pathnameWithoutLocale.startsWith(path)
  )

  if (isProtectedPath) {
    return authMiddleware(request)
  }
  
  return intlMiddleware(request)
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
}