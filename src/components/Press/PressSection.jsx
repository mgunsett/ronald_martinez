import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { FiArrowRight } from 'react-icons/fi'
import { playerData } from '../../data/playerData'

// Prensa "En portada": una nota por vez en grande, con la foto de esa etapa y
// el escudo del club, y abajo una pestaña por medio con una barra que avanza.
// Pasa sola, pero se frena con el mouse encima, con el teclado, si la sección
// no se ve o si la pestaña del navegador está oculta. Elegir una nota a mano
// frena el avance: el lector decidió qué leer.

const C = { acc: '#4D93D6', gold: '#D4A84B', soft: '#C3CFDD', gray: '#7A8CA3', card: '#0B1626', line: 'rgba(255,255,255,0.08)', dark: '#050B14' }
const DUR = 7000
const OUT = 'cubic-bezier(0.23,1,0.32,1)'
const MONTH = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const dateKey = (d = '') => {
  const [mes = '', y = ''] = d.trim().split(/\s+/)
  return Number(y) * 100 + Math.max(MONTH.indexOf(mes.toLowerCase()), 0)
}

export default function PressSection() {
  // La más nueva primero
  const notes = [...playerData.press]
    .map((n) => ({ ...n, crest: playerData.clubs.find((c) => c.name === n.club)?.logo }))
    .sort((a, b) => dateKey(b.date) - dateKey(a.date))
  const season = notes[0]?.date.split(/\s+/)[1]

  const [cur, setCur] = useState(0) // pestaña activa
  const [shown, setShown] = useState(0) // nota que se ve (cambia al terminar la salida)
  const [manual, setManual] = useState(false)
  const secRef = useRef(null)
  const storyRef = useRef(null)
  const picRef = useRef(null)
  const tabRefs = useRef([])
  const barRefs = useRef([])
  const run = useRef(null)
  const busy = useRef([])
  const entering = useRef(false)
  const st = useRef({ hover: false, focus: false, visible: false })
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const manualRef = useRef(false)
  manualRef.current = manual
  const paused = () => st.current.hover || st.current.focus || !st.current.visible || document.hidden || manualRef.current
  const sync = useCallback(() => {
    if (run.current) (paused() ? run.current.pause() : run.current.play())
  }, [])

  // Cambio de nota: sale rápido con blur y entra con ease-out
  const show = useCallback((i, instant = false) => {
    setCur(i)
    const s = storyRef.current, p = picRef.current
    if (instant || reduce || !s?.animate) { busy.current.forEach((a) => a.cancel()); setShown(i); return }
    busy.current.forEach((a) => a.cancel())
    const a = s.animate([{ opacity: 1, filter: 'blur(0)', transform: 'none' }, { opacity: 0, filter: 'blur(4px)', transform: 'translateY(-6px)' }], { duration: 120, easing: 'ease', fill: 'forwards' })
    const b = p.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: 'ease', fill: 'forwards' })
    busy.current = [a, b]
    a.onfinish = () => { entering.current = true; setShown(i) }
  }, [reduce])

  useLayoutEffect(() => {
    if (!entering.current) return
    entering.current = false
    busy.current.forEach((x) => x.cancel())
    busy.current = [
      storyRef.current.animate([{ opacity: 0, filter: 'blur(4px)', transform: 'translateY(8px)' }, { opacity: 1, filter: 'blur(0)', transform: 'none' }], { duration: 260, easing: OUT }),
      picRef.current.animate([{ opacity: 0, transform: 'scale(1.03)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: OUT }),
    ]
  }, [shown])

  // Barra de la pestaña activa: lineal, con pausa real (Web Animations)
  useEffect(() => {
    run.current?.cancel()
    run.current = null
    barRefs.current.forEach((b) => b?.getAnimations().forEach((x) => x.cancel()))
    const bar = barRefs.current[cur]
    if (reduce || !bar?.animate) return
    if (manual) { bar.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(1)' }], { duration: 1, fill: 'forwards' }); return }
    const a = bar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: DUR, easing: 'linear', fill: 'forwards' })
    a.onfinish = () => show((cur + 1) % notes.length)
    run.current = a
    if (paused()) a.pause()
    return () => a.cancel()
  }, [cur, manual])

  // Pausas: mouse encima, foco adentro, sección fuera de pantalla o pestaña oculta
  useEffect(() => {
    const el = secRef.current
    if (!el) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const on = (k, v) => () => { st.current[k] = v; sync() }
    const enter = on('hover', true), leave = on('hover', false), fin = on('focus', true), fout = on('focus', false)
    if (fine) { el.addEventListener('mouseenter', enter); el.addEventListener('mouseleave', leave) }
    el.addEventListener('focusin', fin); el.addEventListener('focusout', fout)
    document.addEventListener('visibilitychange', sync)
    const io = new IntersectionObserver(([e]) => { st.current.visible = e.isIntersecting; sync() }, { threshold: 0.35 })
    io.observe(el)
    return () => {
      el.removeEventListener('mouseenter', enter); el.removeEventListener('mouseleave', leave)
      el.removeEventListener('focusin', fin); el.removeEventListener('focusout', fout)
      document.removeEventListener('visibilitychange', sync)
      io.disconnect()
    }
  }, [sync])

  const pick = (i) => { setManual(true); if (i !== cur) show(i) }
  const onKey = (e) => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
    if (!d) return
    e.preventDefault()
    const n = (cur + d + notes.length) % notes.length
    setManual(true)
    show(n, true) // con teclado, sin animación
    tabRefs.current[n]?.focus()
  }

  const n = notes[shown]
  if (!n) return null

  return (
    <Box as="section" id="prensa" ref={secRef} bg="brand.dark" px={{ base: 5, lg: 10 }} py={{ base: 16, lg: 24 }}>
      <Box maxW="1400px" mx="auto" sx={css}>
        <div className="mast">
          <div>
            <Text fontFamily="mono" fontSize="11px" fontWeight={700} letterSpacing="0.24em" textTransform="uppercase" color={C.gold}>
              En los medios
            </Text>
            <Text as="h2" fontFamily="heading" fontSize={{ base: '44px', md: 'clamp(44px, 5.4vw, 84px)' }} lineHeight={0.9} color={C.acc}>
              Prensa
            </Text>
          </div>
          <div className="ed">
            Edición N.º <b>{playerData.number}</b>
            {season && <><br />Temporada {season}</>}
          </div>
        </div>

        <div className="stage" id="pr-stage" role="tabpanel" aria-labelledby={`pr-tab-${cur}`} aria-live="polite">
          <div className="story" ref={storyRef}>
            <div>
              <div className="src">
                <img src={n.logo} alt="" />
                <div><b>{n.media}</b><span>{n.date}</span></div>
              </div>
              <h3><q>{n.title}</q></h3>
              {n.excerpt && <p className="lead">{n.excerpt}</p>}
            </div>
            <a className="go" href={n.url} target="_blank" rel="noopener noreferrer">
              Leer la nota <FiArrowRight aria-hidden="true" />
            </a>
          </div>
          <div className="pic" ref={picRef}>
            {n.photo && <img className="ph" src={n.photo} alt={n.photoAlt || ''} loading="lazy" />}
            {n.club && (
              <span className="badge">{n.crest && <img src={n.crest} alt="" />}{n.club}</span>
            )}
          </div>
        </div>

        <div className="tabs" role="tablist" aria-label="Notas de prensa" onKeyDown={onKey}>
          {notes.map((t, i) => (
            <button
              key={t.url}
              ref={(el) => (tabRefs.current[i] = el)}
              id={`pr-tab-${i}`}
              className={`tab${i < cur ? ' done' : ''}`}
              role="tab"
              type="button"
              aria-selected={i === cur}
              aria-controls="pr-stage"
              tabIndex={i === cur ? 0 : -1}
              onClick={() => pick(i)}
            >
              <span className="bar"><i ref={(el) => (barRefs.current[i] = el)} /></span>
              <small>{String(i + 1).padStart(2, '0')} · <span className="full">{t.date}</span><span className="short">{t.date.slice(0, 3)} {t.date.split(/\s+/)[1]}</span></small>
              <b>{t.media}</b>
            </button>
          ))}
        </div>
      </Box>
    </Box>
  )
}

const label = { fontFamily: 'mono', fontWeight: 700, textTransform: 'uppercase' }

const css = {
  '.mast': {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px',
    pb: '18px', borderBottom: '2px solid white', mb: { base: '22px', lg: '34px' },
  },
  '.ed': { ...label, textAlign: 'right', fontSize: '11px', letterSpacing: '0.22em', color: C.gray, lineHeight: 1.8, b: { color: C.gold } },
  '.stage': {
    display: 'grid', gridTemplateColumns: { base: 'minmax(0,1fr)', lg: 'minmax(0,1.15fr) minmax(0,1fr)' },
    gap: { base: '22px', lg: '48px' }, alignItems: 'stretch', minH: { lg: '440px' },
  },
  '.story': { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: { base: '20px', lg: '26px' }, willChange: 'opacity, transform, filter' },
  '.src': { display: 'flex', alignItems: 'center', gap: '14px' },
  '.src img': { w: '48px', h: '48px', borderRadius: '12px', objectFit: 'cover', bg: 'white' },
  '.src b': { ...label, display: 'block', fontSize: '14px', letterSpacing: '0.2em' },
  '.src span': { ...label, display: 'block', mt: '4px', fontSize: '12px', letterSpacing: '0.18em', color: C.gray },
  '.story h3': {
    mt: { base: '16px', lg: '24px' }, fontFamily: 'heading', fontWeight: 400, textTransform: 'uppercase', lineHeight: 0.98,
    fontSize: { base: '26px', lg: 'clamp(34px, 3.2vw, 52px)' }, textWrap: 'balance',
  },
  '.story h3 q': { quotes: '"“" "”"', '&::before, &::after': { color: C.gold } },
  '.story .lead': { mt: { base: '12px', lg: '18px' }, maxW: '46ch', fontSize: { base: '16px', lg: '18px' }, lineHeight: 1.5, color: C.soft },
  '.go': {
    ...label, alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '12px', p: '15px 22px', borderRadius: '999px',
    bg: C.acc, color: C.dark, textDecoration: 'none', fontSize: '13px', letterSpacing: '0.18em',
    transition: `transform 160ms ${OUT}`,
    svg: { transition: `transform 200ms ${OUT}` },
    '&:active': { transform: 'scale(0.97)' },
    '&:focus-visible': { outline: '2px solid white', outlineOffset: '3px' },
  },
  '.pic': {
    position: 'relative', borderRadius: '20px', overflow: 'hidden', bg: C.card, order: { base: -1, lg: 0 },
    minH: { lg: '320px' }, aspectRatio: { base: '4 / 3', lg: 'auto' }, willChange: 'opacity, transform',
    '&::after': { content: '""', position: 'absolute', inset: 0, background: 'linear-gradient(200deg, transparent 50%, rgba(5,11,20,.7))' },
  },
  '.pic .ph': { position: 'absolute', inset: 0, w: '100%', h: '100%', objectFit: 'cover' },
  '.badge': {
    ...label, position: 'absolute', left: '18px', bottom: '18px', zIndex: 2, display: 'flex', alignItems: 'center', gap: '10px',
    p: '8px 14px 8px 8px', borderRadius: '999px', bg: 'rgba(5,11,20,.72)', backdropFilter: 'blur(8px)',
    fontSize: '12px', letterSpacing: '0.16em', color: 'white',
    img: { w: '26px', h: '26px', objectFit: 'contain' },
  },
  // Pestañas con barra de avance
  '.tabs': { display: 'grid', gridTemplateColumns: `repeat(${playerData.press.length}, minmax(0,1fr))`, mt: { base: '28px', lg: '40px' }, borderTop: `1px solid ${C.line}` },
  '.tab': {
    position: 'relative', display: 'block', p: { base: '14px 10px 12px 0', lg: '18px 20px 16px 0' }, border: 0, bg: 'none',
    color: C.gray, textAlign: 'left', cursor: 'pointer', transition: 'color 200ms ease',
    '&:focus-visible': { outline: `2px solid ${C.acc}`, outlineOffset: '-2px' },
    '&[aria-selected=true]': { color: 'white' },
  },
  '.tab + .tab': { pl: { base: '10px', lg: '20px' }, borderLeft: `1px solid ${C.line}` },
  '.tab small': { ...label, display: 'block', fontSize: { base: '10px', lg: '11px' }, letterSpacing: { base: '0.14em', lg: '0.22em' } },
  '.tab b': { display: 'block', mt: '6px', fontFamily: 'heading', fontWeight: 400, fontSize: { base: '15px', lg: '22px' }, lineHeight: 1.1, textTransform: 'uppercase' },
  '.tab .full': { display: { base: 'none', md: 'inline' } },
  '.tab .short': { display: { base: 'inline', md: 'none' } },
  '.tab .bar': { position: 'absolute', left: 0, right: 0, top: '-1px', h: '2px', overflow: 'hidden' },
  '.tab .bar i': { display: 'block', h: '100%', bg: C.gold, transform: 'scaleX(0)', transformOrigin: 'left' },
  '.tab.done .bar i': { transform: 'scaleX(1)', bg: 'rgba(255,255,255,.18)' },
  '@media (hover: hover) and (pointer: fine)': {
    '.tab:not([aria-selected=true]):hover': { color: '#C9D5E3' },
    '.go:hover svg': { transform: 'translateX(4px)' },
  },
  '@media (prefers-reduced-motion: reduce)': { '.go, .go svg': { transition: 'none' } },
}
