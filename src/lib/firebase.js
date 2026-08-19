import { initializeApp } from 'firebase/app'
import { getFirestore, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Identifica a este jugador dentro del proyecto Firebase compartido
// (varias landings usan el mismo proyecto, namespaceado por slug en Firestore/Storage)
export const PLAYER_SLUG = import.meta.env.VITE_PLAYER_SLUG || ''

const requiredKeys = ['apiKey', 'projectId']
export const isFirebaseConfigured =
  requiredKeys.every((k) => Boolean(firebaseConfig[k])) && Boolean(PLAYER_SLUG)

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null
export const db = app ? getFirestore(app) : null
export const auth = app ? getAuth(app) : null
export const storage = app ? getStorage(app) : null

// Doc de partidos ('last' | 'next') namespaceado bajo el jugador actual
export function playerMatchDoc(slot) {
  return doc(db, 'players', PLAYER_SLUG, 'matches', slot)
}
