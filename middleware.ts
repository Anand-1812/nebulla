import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/site',
  '/agency',
  '/agency/sign-in(.*)',
  '/agency/sign-up(.*)',
  '/api/uploadthing(.*)'
])

export default clerkMiddleware(async (auth, req) => {

  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  // check the user route
  const url = req.nextUrl;
  const searchParams = url.searchParams.toString();
  let hostname = req.headers;

  if (url.pathname.startsWith('/api/uploadthing')) {
    return NextResponse.next();
  }

  // converted this to the whole path
  const pathWithSearchParams = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // if there is any sub-domain
  const host = hostname.get('host') ?? "";
  const baseDomain = process.env.NEXT_PUBLIC_DOMAIN!;

  let customSubDomain: string | null = null;

  if (host.endsWith(baseDomain)) {
    const sub = host.replace(`.${baseDomain}`, '');
    if (sub && sub !== baseDomain) {
      customSubDomain = sub;
    }
  }

  // whole layout of app
  if (customSubDomain) {
    return NextResponse.rewrite(new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url))
  }

  if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
    return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
  }

  if ((url.pathname === "/" || url.pathname === "/site") && host === baseDomain) {
    return NextResponse.rewrite(new URL('/site', req.url))
  }

  if (url.pathname.startsWith('/agency') || url.pathname.startsWith('/subaccount')) {
    return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
  }

  return NextResponse.next();

})

export const config = {
  matcher: [
    // Skip static assets and Next internal files
    '/((?!_next|.*\\..*).*)',
    '/(api|trpc)(.*)'
  ],
}

