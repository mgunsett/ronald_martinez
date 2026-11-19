// ─── QUÉ MOSTRAR DE LA TEMPORADA ─────────────────────────────────
// Arma los datos de temporada a partir de los totales que llegan de
// API-Football (players/{slug}/stats/season). Regla:
//   - Siempre partidos.
//   - Según la posición del jugador, los datos que más lo representan.
//   - Un dato que la API no trae (null) no se muestra.

const isNum = (v) => typeof v === 'number' && Number.isFinite(v)
const pct = (v) => (isNum(v) ? `${Math.round(v)}%` : null)
const ratio = (ok, total) => (isNum(ok) && isNum(total) && total > 0 ? `${Math.round((ok / total) * 100)}%` : null)
const minutes = (v) => (isNum(v) ? `${v.toLocaleString('es-AR')}'` : null)
const rating = (v) => (isNum(v) ? v.toFixed(1) : null)

const BY_POSITION = {
  ARQ: (s) => [
    { label: 'Minutos', value: minutes(s.minutos) },
    { label: 'Atajadas', value: s.atajadas },
    { label: 'Goles recibidos', value: s.golesRec },
    { label: 'Precisión pase', value: pct(s.precisionPases) },
    { label: 'Valoración', value: rating(s.rating) },
  ],
  DEF: (s) => [
    { label: 'Goles', value: s.goles },
    { label: 'Asistencias', value: s.asistencias },
    { label: 'Duelos ganados', value: ratio(s.duelosG, s.duelos) },
    { label: 'Intercepciones', value: s.intercepciones },
    { label: 'Precisión pase', value: pct(s.precisionPases) },
  ],
  MED: (s) => [
    { label: 'Minutos', value: minutes(s.minutos) },
    { label: 'Goles', value: s.goles },
    { label: 'Asistencias', value: s.asistencias },
    { label: 'Pases clave', value: s.pasesClave },
    { label: 'Valoración', value: rating(s.rating) },
  ],
  DEL: (s) => [
    { label: 'Minutos', value: minutes(s.minutos) },
    { label: 'Goles', value: s.goles },
    { label: 'Asistencias', value: s.asistencias },
    { label: 'Tiros al arco', value: s.tirosArco },
    { label: 'Valoración', value: rating(s.rating) },
  ],
}

// Posición de este jugador (ARQ/DEF/MED/DEL) por si la API no la informa.
export const FALLBACK_POSITION = 'DEL'

export function seasonTiles(season, fallbackPosition = FALLBACK_POSITION) {
  const pick = BY_POSITION[season.posicion] || BY_POSITION[fallbackPosition] || BY_POSITION.MED
  return [{ label: 'Partidos', value: season.partidos }, ...pick(season)]
    .filter((t) => t.value !== null && t.value !== undefined)
}

// Título de la temporada en curso ("Temporada 2026"); cambia solo de año.
export function seasonTitle(season, fallback) {
  return season ? `Temporada ${season.temporada}` : fallback
}
