import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function CozinhaLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const STAFF_ROLES = ['owner', 'operator', 'kitchen']
  if (!profile?.role || !STAFF_ROLES.includes(profile.role)) {
    redirect('/admin/login')
  }

  return <>{children}</>
}
