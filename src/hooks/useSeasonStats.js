import { useState, useEffect } from 'react'
import { isFirebaseConfigured } from '../lib/firebase'

// Una sola lectura por visita aunque varios componentes usen el hook.
let request = null
function loadSeason() {
  if (!request) {
    request = Promise.all([import('firebase/firestore'), import('../lib/firebase')])
      .then(([{ getDoc }, { playerStatsDoc }]) => getDoc(playerStatsDoc('season')))
      .then((snap) => (snap.exists() ? snap.data() : null))
      .catch(() => null)
  }
  return request
}

// Totales de la temporada en curso (players/{slug}/stats/season), que
// carga la sincronización con API-Football desde el panel de resultados.
// null mientras carga o si no hay datos: la landing usa entonces los
// valores fijos de playerData.
export default function useSeasonStats() {
  const [season, setSeason] = useState(null)

  useEffect(() => {
    if (!isFirebaseConfigured) return
    let cancelled = false
    loadSeason().then((data) => { if (!cancelled && data) setSeason(data) })
    return () => { cancelled = true }
  }, [])

  return season
}
