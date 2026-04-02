import { useState, useEffect } from 'react'
import { AuthScreen } from './components/Auth/AuthScreen.jsx'
import { PageCarousel } from './components/ui/PageCarousel.jsx'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [supabaseReady, setSupabaseReady] = useState(false)

  useEffect(() => {
    async function initSupabase() {
      try {
        const { supabase, supabaseConfigured } = await import('@shared/lib/supabase.js')

        if (!supabaseConfigured) {
          // No Supabase configured — skip auth, go straight to app
          setSupabaseReady(false)
          setLoading(false)
          return
        }

        setSupabaseReady(true)
        const { data } = await supabase.auth.getSession()
        setSession(data.session)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
          setSession(s)
        })
        setLoading(false)
        return () => subscription.unsubscribe()
      } catch {
        setLoading(false)
      }
    }
    initSupabase()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center" style={{ backgroundColor: 'rgba(8,12,16,0.87)' }}>
        <div className="h-8 w-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--accent-teal)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  // If Supabase isn't set up yet, skip auth gate
  if (!supabaseReady) {
    return <PageCarousel userId={null} />
  }

  async function handleLogout() {
    try {
      const { supabase } = await import('@shared/lib/supabase.js')
      await supabase.auth.signOut()
    } catch { /* session will clear via onAuthStateChange */ }
  }

  if (!session) {
    return <AuthScreen onAuth={setSession} />
  }

  return <PageCarousel userId={session.user.id} onLogout={handleLogout} />
}
