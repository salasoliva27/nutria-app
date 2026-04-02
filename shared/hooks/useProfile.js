import { useState, useEffect, useCallback } from 'react'

export function useProfile(userId) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    loadProfile()
  }, [userId])

  async function loadProfile() {
    setLoading(true)
    try {
      const { supabase, supabaseConfigured } = await import('../lib/supabase.js')
      if (!supabaseConfigured) return
      const { data } = await supabase
        .from('nutria_patient_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      if (data) setProfile(data)
    } catch {
      // no profile yet — that's fine
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = useCallback(
    async (updates) => {
      if (!userId) return
      try {
        const { supabase, supabaseConfigured } = await import('../lib/supabase.js')
        if (!supabaseConfigured) return
        // Merge with existing profile so partial updates don't wipe fields
        const merged = { ...profile, ...updates, user_id: userId, updated_at: new Date().toISOString() }
        // Remove db-managed fields before upsert
        const { id: _id, created_at: _c, ...payload } = merged
        const { data } = await supabase
          .from('nutria_patient_profiles')
          .upsert(payload, { onConflict: 'user_id' })
          .select()
          .single()
        if (data) setProfile(data)
      } catch (err) {
        console.error('Failed to save profile:', err)
      }
    },
    [userId, profile],
  )

  return { profile, loading, saveProfile }
}
