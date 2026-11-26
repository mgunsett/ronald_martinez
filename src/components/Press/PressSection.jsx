import { useEffect, useRef } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { FiArrowRight } from 'react-icons/fi'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playerData } from '../../data/playerData'

gsap.registerPlugin(ScrollTrigger)

// Prensa "Cronología": las notas en orden sobre una línea que se dibuja al
// bajar. Cada nota con mes, medio, el club en el que estaba, titular y bajada.

const C = { card: '#0B1626', line: 'rgba(255,255,255,0.08)', acc: '#4D93D6', gold: '#D4A84B', soft: '#C3CFDD', gray: '#7A8CA3' }
const SHORT = { enero: 'Ene', febrero: 'Feb', marzo: 'Mar', abril: 'Abr', mayo: 'May', junio: 'Jun', julio: 'Jul', agosto: 'Ago', septiembre: 'Sep', octubre: 'Oct', noviembre: 'Nov', diciembre: 'Dic' }
const MONTH = Object.keys(SHORT)

// "Diciembre 2025" -> { m: 'Dic', y: '2025', key: 202511 } para ordenar y mostrar
function parseDate(d = '') {
  const [mes = '', y = ''] = d.trim().split(/\s+/)
  const i = MONTH.indexOf(mes.toLowerCase())
  return { m: SHORT[mes.toLowerCase()] || mes, y, key: Number(y) * 100 + Math.max(i, 0) }
}

export default function PressSection() {
  const ref = useRef(null)
  const notes = playerData.press
    .map((n) => ({ ...n, ...parseDate(n.date), crest: playerData.clubs.find((c) => c.name === n.club)?.logo }))
    .sort((a, b) => a.key - b.key)
  const outlets = new Set(notes.map((n) => n.media)).size
  const years = [...new Set(notes.map((n) => n.y.slice(2)))]
  const period = years.length > 1 ? `${years[0]}–${years[years.length - 1]}` : years[0]

  // Una sola coreografía: la línea se dibuja y las notas entran una tras otra
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 70%', once: true } })
      tl.from('.pr-axis', { scaleY: 0, transformOrigin: 'top', duration: 0.9, ease: 'power3.inOut' })
        .from('.pr-rv', { y: 12, opacity: 0, duration: 0.45, stagger: 0.11, ease: 'power3.out' }, 0.12)
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <Box as="section" id="prensa" ref={ref} bg="brand.dark" px={{ base: 5, lg: 10 }} py={{ base: 16, lg: 24 }}>
      <Box maxW="1400px" mx="auto" sx={css}>
        <div className="lay">
          <div className="intro">
            <Text fontFamily="mono" fontSize="11px" fontWeight={700} letterSpacing="0.24em" textTransform="uppercase" color={C.gold}>
              En los medios
            </Text>
            <Text as="h2" fontFamily="heading" fontSize={{ base: '6xl', lg: '8xl' }} lineHeight={0.9} color={C.acc}>
              Prensa
            </Text>
            <p>
              Lo que se publicó de {playerData.displayName}, en orden: del gol que lo hizo goleador del torneo a la vuelta a la Selección.
            </p>
            <div className="meta">
              <div><b>{notes.length}</b><small>Notas</small></div>
              <div><b>{outlets}</b><small>Medios</small></div>
              {period && <div><b>{period}</b><small>Período</small></div>}
            </div>
          </div>

          <ol className="tl">
            <div className="ax" aria-hidden="true"><i className="pr-axis" /></div>
            {notes.map((n) => (
              <li key={n.url} className="it pr-rv">
                <div className="when"><b>{n.m}</b><span>{n.y}</span></div>
                <span className="dot" aria-hidden="true" />
                <a className="card" href={n.url} target="_blank" rel="noopener noreferrer">
                  <span className="src"><img src={n.logo} alt="" /><b>{n.media}</b></span>
                  {n.club && (
                    <span className="club">{n.crest && <img src={n.crest} alt="" />}<span>{n.club}</span></span>
                  )}
                  <h3>{n.title}</h3>
                  {n.excerpt && <p>{n.excerpt}</p>}
                  <span className="go">Leer en {n.media} <FiArrowRight aria-hidden="true" /></span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </Box>
    </Box>
  )
}

const out = 'cubic-bezier(0.23,1,0.32,1)'
const label = { fontFamily: 'mono', fontWeight: 700, textTransform: 'uppercase' }

const css = {
  '.lay': { display: 'grid', gridTemplateColumns: { base: 'minmax(0,1fr)', lg: 'minmax(0,0.8fr) minmax(0,1.6fr)' }, gap: { base: '30px', lg: '64px' }, alignItems: 'start' },
  '.intro': { position: { lg: 'sticky' }, top: '100px' },
  '.intro p': { mt: '20px', maxW: '34ch', fontSize: { base: '16px', lg: '18px' }, lineHeight: 1.5, color: C.soft },
  '.meta': { display: 'flex', gap: '28px', mt: '28px' },
  '.meta b': { display: 'block', fontFamily: 'heading', fontWeight: 400, fontSize: '52px', lineHeight: 1, color: C.acc },
  '.meta small': { ...label, fontSize: '11px', letterSpacing: '0.22em', color: C.gray },
  // Línea de tiempo
  '.tl': { position: 'relative', listStyle: 'none', pl: { base: '26px', lg: '150px' } },
  '.ax': { position: 'absolute', left: { base: '5px', lg: '118px' }, top: '8px', bottom: '8px', w: '1px', bg: C.line },
  '.ax i': { position: 'absolute', inset: 0, background: `linear-gradient(${C.gold}, ${C.acc})` },
  '.it': { position: 'relative', mb: '22px', '&:last-of-type': { mb: 0 } },
  '.when': {
    position: { base: 'static', lg: 'absolute' }, left: '-150px', top: '22px', w: { lg: '96px' }, textAlign: { lg: 'right' },
    display: { base: 'flex', lg: 'block' }, alignItems: 'baseline', gap: '10px', mb: { base: '10px', lg: 0 },
  },
  '.when b': { display: 'block', fontFamily: 'heading', fontWeight: 400, fontSize: { base: '30px', lg: '44px' }, lineHeight: 0.9, textTransform: 'uppercase' },
  '.when span': { ...label, display: 'block', mt: { lg: '4px' }, fontSize: '13px', letterSpacing: '0.2em', color: C.gray },
  '.dot': {
    position: 'absolute', left: { base: '-26px', lg: '-38px' }, top: { base: '8px', lg: '30px' }, w: '13px', h: '13px',
    borderRadius: '50%', bg: 'brand.dark', border: `2px solid ${C.gold}`,
  },
  // Nota
  '.card': {
    display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: { base: '14px', lg: '18px 24px' },
    p: { base: '18px', lg: '24px 26px' }, border: `1px solid ${C.line}`, borderRadius: '18px', bg: C.card,
    color: 'inherit', textDecoration: 'none',
    transition: `transform 160ms ${out}, border-color 200ms ease, background 200ms ease`,
    '&:active': { transform: 'scale(0.985)' },
    '&:focus-visible': { outline: `2px solid ${C.acc}`, outlineOffset: '3px' },
  },
  '.src': { display: 'flex', alignItems: 'center', gap: '12px' },
  '.src img': { w: '40px', h: '40px', borderRadius: '10px', objectFit: 'cover', bg: 'white' },
  '.src b': { ...label, fontSize: '13px', letterSpacing: '0.18em' },
  '.club': {
    ...label, display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'start', fontSize: '11px', letterSpacing: '0.18em', color: C.gray,
    border: `1px solid ${C.line}`, borderRadius: '999px', p: { base: '6px', lg: '6px 12px 6px 6px' },
    img: { w: '22px', h: '22px', objectFit: 'contain' },
    span: { display: { base: 'none', lg: 'inline' } },
  },
  '.card h3': {
    gridColumn: '1 / -1', fontFamily: 'heading', fontWeight: 400, textTransform: 'uppercase', lineHeight: 1,
    fontSize: { base: '28px', lg: 'clamp(28px, 2.4vw, 38px)' },
  },
  '.card p': { gridColumn: '1 / -1', mt: '-4px', fontSize: { base: '15px', lg: '16px' }, lineHeight: 1.5, color: C.soft },
  '.go': {
    ...label, gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', letterSpacing: '0.2em', color: C.acc,
    svg: { transition: `transform 200ms ${out}` },
  },
  '@media (hover: hover) and (pointer: fine)': {
    '.card:hover': { borderColor: C.acc, bg: '#0E1D33' },
    '.card:hover .go svg': { transform: 'translateX(4px)' },
  },
  '@media (prefers-reduced-motion: reduce)': { '.card, .go svg': { transition: 'none' } },
}
