import { useEffect, useMemo, useRef } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playerData } from '../../data/playerData'
import useSeasonStats from '../../hooks/useSeasonStats'
import { seasonTiles, seasonTitle } from '../../lib/seasonTiles'

gsap.registerPlugin(ScrollTrigger)

// Paleta del Dossier en oscuro
const C = {
  A: '#4D93D6', // acento azul
  B: '#D4A84B', // dorado: la cifra principal, el mejor atributo y la valoración
  T: '#FFFFFF',
  S: '#C3CFDD',
  gray: '#7A8CA3',
  line: 'rgba(255,255,255,0.1)',
}

const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const num = (v) => parseFloat(String(v ?? '').replace(/[^\d.]/g, '')) || 0
const RING = 2 * Math.PI * 54

// Busca un dato de temporada por etiqueta, sin importar tildes ni mayúsculas.
function useSeasonItems() {
  const season = useSeasonStats()
  return useMemo(() => {
    const items = season ? seasonTiles(season) : playerData.seasonStats
    const by = (re) => items.find((s) => re.test(norm(s.label)))
    const goles = by(/^goles$/)
    const val = by(/valoracion/)
    const rest = items.filter((s) => s !== goles && s !== val)
    return { season, goles, val, rest, by }
  }, [season])
}

export default function StatsDossier() {
  const ref = useRef(null)
  const { season, goles, val, rest, by } = useSeasonItems()

  const G = num(goles?.value)
  const PJ = num(by(/^partidos$/)?.value)
  const T = num(by(/^tiros al arco$/)?.value)
  const MIN = num(by(/^minutos$/)?.value)
  const A = num(by(/^asistencias$/)?.value)
  const V = num(val?.value)

  // Lecturas que salen de cruzar los números; si falta un dato, no se muestra.
  const reads = [
    MIN && G && [`${Math.round(MIN / G)}'`, 'minutos en cancha por cada gol'],
    PJ && G && [(G / PJ).toFixed(2).replace('.', ','), 'goles por partido jugado'],
    T && G && [`${Math.round((G / T) * 100)}%`, 'de sus tiros al arco terminan en gol'],
    G && A && [G + A, 'goles y asistencias en total'],
  ].filter(Boolean)

  const attrs = [...playerData.stats].sort((a, b) => b.value - a.value)
  const media = Math.round(attrs.reduce((t, a) => t + a.value, 0) / (attrs.length || 1))
  const yearShort = (season?.temporada ?? '').toString() || '2026'

  const ficha = [
    ['Posición', playerData.position],
    ['Pie hábil', playerData.foot],
    ['Edad', `${playerData.age} años`],
    ['Altura', playerData.height.replace('m', ' m')],
    ['Peso', playerData.weight.replace('kg', ' kg')],
    ['Origen', playerData.birthPlace.replace('Paraguay', 'PAR')],
  ]

  // Una sola coreografía al entrar en pantalla: columnas, barras y el círculo.
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 75%', once: true } })
      tl.from('.dz-rv', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' })
        .from('.dz-bar', { scaleX: 0, duration: 1.1, stagger: 0.08, ease: 'power2.out' }, 0.3)
        .from('.dz-ring', { attr: { 'stroke-dashoffset': RING }, duration: 1.4, ease: 'power2.out' }, 0.35)
    }, el)
    return () => ctx.revert()
  }, [season])

  return (
    <Box ref={ref} sx={css}>
      <div className="folio">
        <span>Dossier N.º <b>{playerData.number}</b></span><i />
        <span>{seasonTitle(season, 'Temporada 2025 / 2026')}</span>
      </div>
      <Box mb={{ base: 7, lg: 10 }}>
        <Text fontFamily="mono" fontSize="11px" fontWeight={700} letterSpacing="0.24em"
          textTransform="uppercase" color={C.B} mb={1}>
          Informe de la temporada
        </Text>
        <Text as="h2" fontFamily="heading" fontSize={{ base: '6xl', lg: '8xl' }} lineHeight={0.9} color={C.A}>
          Estadísticas
        </Text>
      </Box>

      <div className="body">
        <div className="feat dz-rv">
          <div className="lbl">La cifra que lo define</div>
          {goles && (
            <div className="big">
              <b>{goles.value}</b>
              <span>{goles.label}<br />en {yearShort}</span>
            </div>
          )}
          <ul>
            {reads.map(([b, t]) => (
              <li key={t}><b>{b}</b><span>{t}</span></li>
            ))}
          </ul>
        </div>

        <div className="tabc dz-rv">
          <div className="lbl">Tablero</div>
          <div className="nums">
            {rest.map((s) => (
              <div key={s.label} className="n"><b>{s.value}</b><small>{s.label}</small></div>
            ))}
            {val && (
              <div className="hl">
                <small>{val.label}</small>
                <div className="ring">
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <circle className="bg" cx="60" cy="60" r="54" />
                    <circle className="fg dz-ring" cx="60" cy="60" r="54"
                      strokeDasharray={RING} strokeDashoffset={RING * (1 - Math.min(V, 10) / 10)} />
                  </svg>
                  <b>{val.value}</b>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rankc dz-rv">
          <div className="lbl">Atributos, de mayor a menor</div>
          <div className="rank">
            {attrs.map((a, i) => (
              <div key={a.label} className={`rk${i ? '' : ' first'}`}>
                <i>{String(i + 1).padStart(2, '0')}</i>
                <span>{!i && <em>Su mejor arma</em>}{a.label}</span>
                <b>{a.value}</b>
                <u><span className="dz-bar" style={{ width: `${a.value}%` }} /></u>
              </div>
            ))}
          </div>
          <div className="media">Media general <b>{media}</b></div>
        </div>
      </div>

      <div className="ficha">
        {ficha.map(([k, v]) => (
          <div key={k}><small>{k}</small><b>{v}</b></div>
        ))}
      </div>
    </Box>
  )
}

const lbl = {
  fontFamily: 'mono', fontSize: '11px', fontWeight: 700, letterSpacing: '0.24em',
  textTransform: 'uppercase', color: C.gray,
}

const css = {
  '.folio': {
    ...lbl, display: 'flex', gap: '18px', alignItems: 'center', mb: '14px',
    b: { color: C.B }, i: { flex: 1, height: '1px', bg: C.line },
  },
  '.lbl': lbl,
  '.body': {
    display: 'grid', gridTemplateColumns: { base: '1fr', md: '1fr 1fr', xl: 'minmax(0,1.05fr) minmax(0,1fr) minmax(0,1fr)' },
    borderTop: `2px solid ${C.T}`,
  },
  '.body > *': { p: { base: '22px 0', xl: '26px 28px 30px' }, minW: 0 },
  '.body > :first-of-type': { pl: 0 },
  '.body > :last-of-type': { pr: 0 },
  '.body > * + *': {
    borderLeft: { base: 0, md: `1px solid ${C.line}` },
    borderTop: { base: `1px solid ${C.line}`, md: 0 },
  },
  '.body > .tabc': { pl: { md: '24px', xl: '28px' } },
  '.body > .rankc': {
    gridColumn: { md: '1 / -1', xl: 'auto' },
    borderLeft: { md: 0, xl: `1px solid ${C.line}` },
    borderTop: { md: `1px solid ${C.line}`, xl: 0 },
    pl: { xl: '28px' },
  },
  // Portada
  '.big': { display: 'flex', alignItems: 'flex-end', gap: '14px', mt: '14px' },
  '.big b': {
    fontFamily: 'heading', fontWeight: 400, lineHeight: 0.8, color: C.B,
    fontSize: { base: '44vw', md: '180px', xl: 'clamp(150px, 14vw, 240px)' },
  },
  '.big span': {
    fontFamily: 'mono', fontSize: '15px', fontWeight: 700, letterSpacing: '0.18em',
    textTransform: 'uppercase', color: C.T, pb: '12px', lineHeight: 1.3,
  },
  '.feat ul': { listStyle: 'none', mt: '24px', borderTop: `1px solid ${C.line}` },
  '.feat li': {
    display: 'grid', gridTemplateColumns: '84px 1fr', gap: '14px', alignItems: 'baseline',
    py: '13px', borderBottom: `1px solid ${C.line}`, fontSize: '15px', color: C.S, lineHeight: 1.35,
  },
  '.feat li b': { fontFamily: 'heading', fontWeight: 400, fontSize: '32px', color: C.A, lineHeight: 1 },
  // Tablero
  '.tabc': { display: 'flex', flexDirection: 'column' },
  '.nums': { flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto 1fr', mt: '14px' },
  '.nums .n': { py: '18px', borderBottom: `1px solid ${C.line}` },
  '.nums .n:nth-of-type(even)': { pl: '20px', borderLeft: `1px solid ${C.line}` },
  '.nums .n b': {
    display: 'block', fontFamily: 'heading', fontWeight: 400, lineHeight: 0.9, color: C.T,
    fontSize: { base: '52px', xl: 'clamp(48px, 4.2vw, 72px)' },
  },
  '.nums small, .hl > small': {
    display: 'block', mt: '8px', fontFamily: 'mono', fontSize: '11px',
    letterSpacing: '0.2em', color: C.gray, textTransform: 'uppercase',
  },
  '.hl': {
    gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '14px', pt: '22px', pb: '6px', textAlign: 'center',
  },
  '.hl > small': { mt: 0 },
  '.ring': { position: 'relative', w: { base: '170px', xl: 'clamp(150px, 13vw, 190px)' }, aspectRatio: '1' },
  '.ring svg': { w: '100%', h: '100%', transform: 'rotate(-90deg)', overflow: 'visible' },
  '.ring circle': { fill: 'none', strokeWidth: 9 },
  '.ring .bg': { stroke: C.line },
  '.ring .fg': { stroke: C.B, strokeLinecap: 'round', filter: 'drop-shadow(0 0 10px rgba(212,168,75,0.45))' },
  '.ring b': {
    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'heading', fontWeight: 400, lineHeight: 1, color: C.T,
    fontSize: { base: '64px', xl: 'clamp(56px, 5vw, 80px)' },
  },
  // Ranking
  '.rank': { mt: '14px' },
  '.rk': {
    display: 'grid', gridTemplateColumns: '26px minmax(0,1fr) 48px',
    gridTemplateAreas: '"n l v" "n u v"', gap: '6px 12px', alignItems: 'center',
    py: '11px', borderBottom: `1px solid ${C.line}`,
  },
  '.rk i': { gridArea: 'n', fontStyle: 'normal', fontFamily: 'mono', fontSize: '12px', color: C.gray },
  '.rk > span': { gridArea: 'l', fontSize: '16px', fontWeight: 500, color: C.T },
  '.rk > b': { gridArea: 'v', justifySelf: 'end', fontFamily: 'heading', fontWeight: 400, fontSize: '30px', lineHeight: 1, color: C.A },
  '.rk u': { gridArea: 'u', display: 'block', h: '4px', bg: C.line, borderRadius: '2px', overflow: 'hidden', textDecoration: 'none' },
  '.rk u span': { display: 'block', h: '100%', bg: C.A, borderRadius: '2px', transformOrigin: 'left' },
  '.rk.first': { py: '14px' },
  '.rk.first > span': { fontWeight: 700, fontSize: '19px' },
  '.rk.first > b': { color: C.B, fontSize: '40px' },
  '.rk.first u': { h: '6px' },
  '.rk.first u span': { bg: C.B },
  '.rk em': {
    display: 'block', fontStyle: 'normal', fontFamily: 'mono', fontSize: '11px', fontWeight: 700,
    letterSpacing: '0.2em', textTransform: 'uppercase', color: C.B, mb: '2px',
  },
  '.media': {
    ...lbl, fontWeight: 400, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: '16px',
    b: { fontFamily: 'heading', fontWeight: 400, fontSize: '28px', color: C.T, letterSpacing: 0 },
  },
  // Ficha al pie
  '.ficha': {
    display: 'grid', gridTemplateColumns: { base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', xl: 'repeat(6, minmax(0,1fr))' },
    borderTop: `1px solid ${C.line}`, borderBottom: `2px solid ${C.T}`,
  },
  '.ficha div': { py: '16px', pr: '16px', borderBottom: { base: `1px solid ${C.line}`, xl: 0 } },
  '.ficha div:nth-of-type(n+2)': { pl: { xl: '16px' }, borderLeft: { xl: `1px solid ${C.line}` } },
  '.ficha div:nth-of-type(even)': { pl: { base: '16px', md: 0, xl: '16px' }, borderLeft: { base: `1px solid ${C.line}`, md: 0, xl: `1px solid ${C.line}` } },
  '.ficha small': { display: 'block', fontFamily: 'mono', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gray },
  '.ficha b': { display: 'block', mt: '6px', fontSize: '16px', fontWeight: 700, color: C.T },
}
