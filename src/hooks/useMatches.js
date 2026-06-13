import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { defaultMatches, rowToMatch } from '../data/matchData'

export default function useMatches() {
  const [matches, setMatches] = useState(defaultMatches)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    const fetchMatches = async () => {
      try {
        const { data, error } = await supabase.from('matches').select('*')
        if (error) throw error

        const result = { ...defaultMatches }
        data.forEach((row) => {
          if (row.slot === 'last' || row.slot === 'next') {
            result[row.slot] = rowToMatch(row)
          }
        })
        setMatches(result)
      } catch {
        // falls back to defaultMatches silently
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  return { matches, loading }
}
