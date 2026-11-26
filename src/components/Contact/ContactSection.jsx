import { useEffect, useRef } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { FaInstagram } from 'react-icons/fa'
import { FiArrowUpRight } from 'react-icons/fi'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playerData } from '../../data/playerData'

gsap.registerPlugin(ScrollTrigger)

// Contacto "Directorio": a la izquierda el texto y Transfermarkt; a la derecha
// una fila por contacto (representante, marketing e Instagram personal).

const C = { line: 'rgba(77,147,214,0.25)', acc: '#4D93D6', gold: '#D4A84B', soft: '#D6E0EC', gray: '#7A8CA3', disc: '#131D2B' }

export function ContactSection() {
  const ref = useRef(null)
  const ig = playerData.socialMedia.find((s) => s.label === 'Instagram')
  const tm = playerData.socialMedia.find((s) => /transfermarkt/i.test(s.label))
  const first = playerData.displayName.split(' ')[0]

  const rows = [
    ...playerData.contact.map((c) => ({ role: c.title, name: c.label, handle: c.handle, url: c.url, for: c.for, image: c.image })),
    ig && { role: `Directo con ${first}`, name: 'Instagram personal', handle: ig.handle, url: ig.url, for: 'Saludos, prensa y colaboraciones', isIg: true },
  ].filter(Boolean)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.ct-rv', {
        y: 16, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 75%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <Box as="section" id="contact" ref={ref} bg="brand.dark" px={{ base: 5, lg: 10 }} py={{ base: 16, lg: 24 }}>
      <Box maxW="1400px" mx="auto" sx={css}>
        <div className="g">
          <div className="intro ct-rv">
            <Text fontFamily="mono" fontSize="11px" fontWeight={700} letterSpacing="0.24em" textTransform="uppercase" color={C.gold}>
              Hablemos
            </Text>
            <Text as="h2" fontFamily="heading" fontSize={{ base: '6xl', lg: '8xl' }} lineHeight={0.9} color={C.acc}>
              Contacto
            </Text>
            <p className="lead">Para clubes, marcas o prensa: elegí con quién hablar y escribí directo por Instagram.</p>
            {tm && (
              <div className="soc">
                <a href={tm.url} target="_blank" rel="noopener noreferrer">
                  {tm.image && <img src={tm.image} alt="" />}Transfermarkt <FiArrowUpRight aria-hidden="true" />
                </a>
              </div>
            )}
          </div>

          <ul>
            {rows.map((r) => (
              <li key={r.url} className="ct-rv">
                <a href={r.url} target="_blank" rel="noopener noreferrer" aria-label={`${r.role}: ${r.name} (${r.handle}), abre Instagram`}>
                  <span className={`lg${r.isIg ? ' ig' : ''}`}>
                    {r.isIg ? <FaInstagram aria-hidden="true" /> : r.image ? <img src={r.image} alt="" /> : null}
                  </span>
                  <div>
                    <div className="r">{r.role}</div>
                    <h3>{r.name}</h3>
                    <div className="f">{[r.handle, r.for].filter(Boolean).join(' · ')}</div>
                  </div>
                  <span className="cta"><span>Escribir</span><i aria-hidden="true"><FiArrowUpRight /></i></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Box>
    </Box>
  )
}

const out = 'cubic-bezier(0.23,1,0.32,1)'
const label = { fontFamily: 'mono', fontWeight: 700, textTransform: 'uppercase' }

const css = {
  '.g': { display: 'grid', gridTemplateColumns: { base: 'minmax(0,1fr)', lg: 'minmax(0,1fr) minmax(0,1.6fr)' }, gap: { base: '28px', lg: '60px' } },
  '.intro .lead': { mt: '20px', fontSize: { base: '16px', lg: '18px' }, lineHeight: 1.55, color: C.soft, maxW: '34ch' },
  '.soc': { display: 'flex', gap: '10px', mt: '28px', flexWrap: 'wrap' },
  '.soc a': {
    ...label, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', letterSpacing: '0.14em', color: C.acc,
    textDecoration: 'none', border: `1.5px solid ${C.acc}`, p: '11px 16px', borderRadius: '999px',
    transition: `transform 140ms ${out}, background 200ms ease, color 200ms ease`,
    img: { w: '16px', h: '16px' },
    '&:active': { transform: 'scale(0.97)' },
    '&:focus-visible': { outline: `2px solid ${C.gold}`, outlineOffset: '2px' },
  },
  ul: { listStyle: 'none', borderTop: `1px solid ${C.line}` },
  'li a': {
    display: 'grid', gridTemplateColumns: { base: '56px 1fr', md: '72px 1fr auto' }, gap: { base: '16px', md: '24px' }, alignItems: 'center',
    py: { base: '20px', md: '26px' }, borderBottom: `1px solid ${C.line}`, color: 'white', textDecoration: 'none',
    transition: `transform 220ms ${out}`,
    '&:focus-visible': { outline: `2px solid ${C.gold}`, outlineOffset: '2px' },
  },
  '.lg': {
    w: { base: '56px', md: '72px' }, h: { base: '56px', md: '72px' }, borderRadius: '50%', bg: C.disc, display: 'grid', placeItems: 'center', overflow: 'hidden',
    img: { w: '80%', h: '80%', objectFit: 'contain' },
  },
  '.lg.ig': { color: C.acc, fontSize: { base: '24px', md: '30px' } },
  '.r': { ...label, fontSize: '11px', letterSpacing: '0.22em', color: C.gold },
  'li h3': { mt: '4px', fontFamily: 'heading', fontWeight: 400, fontSize: { base: '30px', lg: 'clamp(32px, 2.8vw, 44px)' }, textTransform: 'uppercase', lineHeight: 1 },
  '.f': { mt: '6px', fontSize: '14px', color: C.gray },
  '.cta': {
    ...label, gridColumn: { base: '2', md: 'auto' }, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', letterSpacing: '0.16em',
    color: C.acc, whiteSpace: 'nowrap',
  },
  '.cta i': {
    fontStyle: 'normal', w: '44px', h: '44px', borderRadius: '50%', border: `1.5px solid ${C.acc}`, display: 'grid', placeItems: 'center', fontSize: '18px',
    transition: `background 200ms ease, color 200ms ease, transform 140ms ${out}`,
  },
  'li a:active .cta i': { transform: 'scale(0.94)' },
  '@media (hover: hover) and (pointer: fine)': {
    'li a:hover': { transform: 'translateX(14px)' },
    'li a:hover .cta i': { bg: C.acc, color: '#050B14' },
    '.soc a:hover': { bg: C.acc, color: '#050B14' },
  },
  '@media (prefers-reduced-motion: reduce)': { 'li a, .cta i, .soc a': { transition: 'none' } },
}

export default ContactSection
