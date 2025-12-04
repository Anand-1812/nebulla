import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/site',
  '/agency/sign-in(.*)',
  '/agency/sign-up(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip static assets and Next internal files
    '/((?!_next|.*\\..*).*)',
    '/(api|trpc)(.*)'
  ],
}

