import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function middleware(req: NextRequest) {
  console.log('Middleware triggered:', req.nextUrl.pathname)  // Log the requested URL

  try {
    const { data: { user } } = await supabase.auth.getUser()

    // If the user is not authenticated and trying to access /admin, redirect to /admin/login
    if (!user && req.nextUrl.pathname.startsWith("/admin") && !req.nextUrl.pathname.startsWith("/admin/login")) {
      console.log('User not authenticated, redirecting to /admin/login')
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    // If the user is authenticated and trying to access /admin/login, redirect to /admin
    if (user && req.nextUrl.pathname.startsWith("/admin/login")) {
      console.log('User authenticated, redirecting to /admin')
      return NextResponse.redirect(new URL("/admin", req.url))
    }

    // Allow the request to continue if user is authenticated or not trying to access /admin
    return NextResponse.next()
  } catch (error) {
    console.error('Error in middleware:', error)
    return NextResponse.next()
  }
}
