import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../lib/firebase'
import { defaultMatches, docToMatch } from '../data/matchData'

export default function useMatches() {
  const [matches, setMatches] = useState(defaultMatches)
  const [loading, setLoading] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!isFirebaseConfigured) return

    const fetchMatches = async () => {
      try {
        const [lastSnap, nextSnap] = await Promise.all([
          getDoc(doc(db, 'matches', 'last')),
          getDoc(doc(db, 'matches', 'next')),
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
