import { useState, useEffect } from 'react'
import { getDoc } from 'firebase/firestore'
import { isFirebaseConfigured, playerMatchDoc } from '../lib/firebase'
import { defaultMatches, docToMatch } from '../data/matchData'

export default function useMatches() {
  const [matches, setMatches] = useState(defaultMatches)
  const [loading, setLoading] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!isFirebaseConfigured) return

    const fetchMatches = async () => {
      try {
        const [lastSnap, nextSnap] = await Promise.all([
          getDoc(playerMatchDoc('last')),
          getDoc(playerMatchDoc('next')),
        ])

        const result = { ...defaultMatches }
        if (lastSnap.exists()) result.last = docToMatch(lastSnap.data())
        if (nextSnap.exists()) result.next = docToMatch(nextSnap.data())
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
