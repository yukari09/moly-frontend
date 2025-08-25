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
    // API 路由直接通过，不需要国际化
    if (req.nextUrl.pathname.startsWith('/api')) {
      return
    }
    return intlMiddleware(req)
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (token == null) return false

        const pathname = req.nextUrl.pathname
        
        // 统一检查 admin 路径（API 和页面）
        if (pathname.includes('/admin')) {
          return token.roles && token.roles.includes('admin')
        }

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
  
  // 受保护的路径
  const protectedPaths = ['/dashboard', '/profile', '/admin', '/settings', '/api/admin']
  
  const pathnameWithoutLocale = pathname.startsWith('/api') 
    ? pathname 
    : getPathnameWithoutLocale(pathname, routing.locales)

  const isProtected = protectedPaths.some(path => pathnameWithoutLocale.startsWith(path))

  if (isProtected) {
    return authMiddleware(request)
  }
  
  // 非保护的 API 路由直接通过
  if (pathname.startsWith('/api')) {
    return
  }
  
  return intlMiddleware(request)
}

export const config = {
  matcher: '/((?!api/(?!admin).*|trpc|_next|_vercel|.*\\..*).*)'
}