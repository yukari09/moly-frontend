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
      authorized: ({ token }) => token != null
    },
    pages: {
      signIn: '/login'  // 确保这个路径在 publicPaths 中
    }
  }
)

export default function middleware(request) {
  const { pathname } = request.nextUrl
  const { locales } = routing
  
  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname, locales)
  
  const publicPaths = [
    '/', 
    '/about', 
    '/contact', 
    '/login',        // 添加登录页面
    '/register',     // 如果有注册页面
    '/auth/signin',  // 如果还需要保留这些路径
    '/auth/signup',
    '/auth/error'
  ]
  
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
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'
  ]
}