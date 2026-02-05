// proxy.ts (It can be at root or src level)
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  // const { pathname } = request.nextUrl;

  // // Skip locale handling for admin routes // UPDATE: SKIPPING IT IN matcher below in config is better and cleaner, but I would need to search about it more before deleting this comment
  // if (pathname.startsWith('/admin')) {
  //   return NextResponse.next()  
  // }

  // Apply internationalization middleware for all other routes
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - files with extensions (e.g. favicon.ico)
  matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)']
};