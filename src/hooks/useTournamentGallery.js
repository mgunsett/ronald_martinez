import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db, isFirebaseConfigured, PLAYER_SLUG } from '../lib/firebase'
import { tournaments as fallbackTournaments } from '../data/galleryTournaments'

/**
 * Galería por secciones. Mismo patrón que useMatches:
 *  - Arranca siempre con src/data/galleryTournaments.js (render instantáneo).
 *  - Con Firebase lee players/{PLAYER_SLUG}/galleries y, si hay datos,
 *    reemplaza a los estáticos. Si la colección no existe, no cambia nada.
 *
 * Shape de cada doc (para cuando migres):
 *  {
 *    name: 'Partidos', order: 1,
 *    coverId: 'img3',                      // opcional, por defecto la primera
 *    photos: [{ id, src, alt, caption }]   // src = downloadURL de Storage
 *  }
 */
function normalize(list) {
  return [...list]
    .filter((t) => Array.isArray(t.photos) && t.photos.length > 0)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
    .map((t) => {
      // La portada pasa a ser la foto 0, así el carrusel arranca en ella
      const i = Math.max(0, t.photos.findIndex((p) => p.id === t.coverId))
      const photos = [...t.photos.slice(i), ...t.photos.slice(0, i)].map((p) => ({
        ...p,
        alt: p.alt || `Ronaldo Martínez, ${t.name}`,
      }))
      return { ...t, photos }
    })
}

export function useTournamentGallery() {
  const [tournaments, setTournaments] = useState(() => normalize(fallbackTournaments))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined
    let cancelled = false
    getDocs(collection(db, 'players', PLAYER_SLUG, 'galleries'))
      .then((snap) => {
        if (cancelled) return
        const loaded = normalize(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        if (loaded.length) setTournaments(loaded)
      })
      .catch((e) => !cancelled && setError(e))
    return () => {
      cancelled = true
    }
  }, [])

  return { tournaments, error }
}

export default useTournamentGallery
