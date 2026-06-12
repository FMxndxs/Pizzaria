import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const STAFF_ROLES = ['owner', 'operator', 'kitchen']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Página de login não precisa de proteção
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, role')
    .eq('id', user.id)
    .single()

  // /cozinha — qualquer staff (owner, operator, kitchen)
  if (pathname.startsWith('/cozinha')) {
    if (!profile?.role || !STAFF_ROLES.includes(profile.role)) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return res
  }

  // /admin/* — apenas admin (owner ou operator)
  if (!profile?.is_admin) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/cozinha/:path*'],
}
