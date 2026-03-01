import { useState, useEffect } from 'react'
import { supabase } from '@/services/supabase'

export function useAuth() {
  const [session, setSession] = useState(undefined) // undefined = loading

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signUp(email, password) {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const user     = session?.user ?? null
  const loading  = session === undefined

  // Derive initials from email: first letter of local part
  function getInitials(user) {
    if (!user) return null
    const name = user.user_metadata?.full_name ?? user.email ?? ''
    const parts = name.split(/[\s@]/)
    if (parts.length >= 2 && !name.includes('@')) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  return { session, user, loading, initials: getInitials(user), signIn, signUp, signOut }
}
