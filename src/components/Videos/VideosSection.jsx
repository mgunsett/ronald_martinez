import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { FiPlay } from 'react-icons/fi'
import { FaInstagram } from 'react-icons/fa'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playerData } from '../../data/playerData'
import useSeasonStats from '../../hooks/useSeasonStats'
import { seasonTiles } from '../../lib/seasonTiles'

gsap.registerPlugin(ScrollTrigger)

// Videos "Destacado + reels": el highlight de YouTube grande arriba, que se
// reproduce en el lugar, y abajo los reels 9:16 de Instagram. En mobile los
// reels son un carrusel con snap y puntos.

const C = { card: '#0B1626', line: 'rgba(255,255,255,0.08)', acc: '#4D93D6', gold: '#D4A84B', soft: '#C3CFDD', gray: '#7A8CA3' }
const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const igProfile = playerData.socialMedia.find((s) => s.label === 'Instagram')
const IG_URL = igProfile?.url || 'https://www.instagram.com/'
const IG_HANDLE = `@${IG_URL.replace(/\/$/, '').split('/').pop()}`

export default function VideosSection() {
  const video = playerData.videos[0]
  const reels = playerData.reels || []
  const season = useSeasonStats()
  const [playing, setPlaying] = useState(false)
  const [dot, setDot] = useState(0)
  const ref = useRef(null)
  const railRef = useRef(null)

  // Goles y valoración de la temporada (API-Football o valores fijos)
  const facts = useMemo(() => {
    const items = season ? seasonTiles(season) : playerData.seasonStats
    const by = (re) => items.find((s) => re.test(norm(s.label)))?.value
    const year = season?.temporada || '2026'
    return [[by(/^goles$/), `Goles en ${year}`], [by(/valoracion/), 'Valoración']].filter(([v]) => v != null)
  }, [season])

  // Una sola entrada escalonada al llegar a la sección
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.dv-rv', {
        y: 12, opacity: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06,
        scrollTrigger: { trigger: el, start: 'top 75%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  const onRailScroll = () => {
    const rail = railRef.current
    if (!rail) return
    const mid = rail.scrollLeft + rail.clientWidth / 2
    let best = 0
    let dist = Infinity
    ;[...rail.children].forEach((li, i) => {
      const d = Math.abs(li.offsetLeft + li.offsetWidth / 2 - mid)
      if (d < dist) { dist = d; best = i }
    })
    setDot(best)
  }

  return (
    <Box as="section" id="videos" ref={ref} bg="brand.dark" px={{ base: 5, lg: 10 }} py={{ base: 16, lg: 24 }} position="relative" zIndex={1}>
      <Box maxW="1400px" mx="auto" sx={css}>
        <div className="head">
          <Box className="dv-rv">
            <Text fontFamily="mono" fontSize="11px" fontWeight={700} letterSpacing="0.24em" textTransform="uppercase" color={C.gold}>
              Highlights
            </Text>
            <Text as="h2" fontFamily="heading" fontSize={{ base: '44px', md: 'clamp(44px, 5.4vw, 84px)' }} lineHeight={0.9} color={C.acc}>
              Videos
            </Text>
          </Box>
          <a className="ig dv-rv" href={IG_URL} target="_blank" rel="noopener noreferrer" aria-label={`Instagram de ${playerData.displayName} (${IG_HANDLE})`}>
            <FaInstagram aria-hidden="true" /><span>{IG_HANDLE}</span>
          </a>
        </div>

        <article className="main dv-rv">
          <div className={`player${playing ? ' on' : ''}`}>
            {playing ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&playsinline=1`}
                title={video.fullTitle}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <>
                <img src={video.cover} alt={`Portada del video ${video.fullTitle}`} />
                {/* El reproductor recién se carga al tocar play */}
                <button type="button" className="play" onClick={() => setPlaying(true)} aria-label={`Reproducir ${video.fullTitle}`}>
                  <span><FiPlay aria-hidden="true" /></span>
                </button>
                <span className="dur">YouTube · {video.duration}</span>
              </>
            )}
          </div>
          <div className="info">
            <div>
              <div className="kk">Video principal</div>
              <h3>Highlights {video.title}</h3>
              <div className="club">
                {video.crest && <img src={video.crest} alt="" />}
                {[video.club, video.league].filter(Boolean).join(' · ')}
              </div>
            </div>
            {facts.length > 0 && (
              <div className="facts">
                {facts.map(([v, l]) => <div key={l}><b>{v}</b><small>{l}</small></div>)}
              </div>
            )}
          </div>
        </article>

        {reels.length > 0 && (
          <>
            <div className="rh dv-rv"><b>Reels de Instagram</b><small>{reels.length} reels</small></div>
            <ul className="reels" ref={railRef} onScroll={onRailScroll}>
              {reels.map((r, i) => (
                <li key={r.title} className="dv-rv">
                  <a className="reel" href={r.url || IG_URL} target="_blank" rel="noopener noreferrer" aria-label={`Ver reel: ${r.title}, en Instagram`}>
                    <img src={r.cover} alt="" loading="lazy" />
                    <span className="tp"><span>Reel {String(i + 1).padStart(2, '0')}</span><FaInstagram aria-hidden="true" /></span>
                    <span className="pl"><FiPlay aria-hidden="true" /></span>
                    <span className="bt"><b>{r.title}</b><small>{r.club}</small></span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="dots" aria-hidden="true">
              {reels.map((r, i) => <i key={r.title} className={i === dot ? 'on' : ''} />)}
            </div>
          </>
        )}
      </Box>
    </Box>
  )
}

const out = 'cubic-bezier(0.23,1,0.32,1)'
const label = { fontFamily: 'mono', fontWeight: 700, textTransform: 'uppercase' }

const css = {
  '.head': { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', mb: { base: '22px', lg: '36px' } },
  '.ig': {
    ...label, display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'white', fontSize: '13px', letterSpacing: '0.16em',
    p: { base: '11px', md: '12px 18px' }, border: `1px solid ${C.line}`, borderRadius: '999px',
    transition: `transform 140ms ${out}, border-color 200ms ease`,
    svg: { w: '18px', h: '18px' },
    span: { display: { base: 'none', md: 'inline' } },
    '&:active': { transform: 'scale(0.97)' },
  },
  // Video principal
  '.main': {
    display: 'grid', gridTemplateColumns: { base: '1fr', lg: 'minmax(0,1.9fr) minmax(0,1fr)' },
    border: `1px solid ${C.line}`, borderRadius: { base: '16px', md: '22px' }, overflow: 'hidden', bg: C.card,
  },
  '.player': { position: 'relative', aspectRatio: '16 / 9', bg: '#000', overflow: 'hidden' },
  '.player img, .player iframe': { position: 'absolute', inset: 0, w: '100%', h: '100%', border: 0, objectFit: 'cover' },
  '.player img': { transition: `transform 600ms ${out}` },
  '.player:not(.on)::after': {
    content: '""', position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'linear-gradient(180deg, transparent 55%, rgba(5,11,20,0.7))',
  },
  '.play': { position: 'absolute', inset: 0, zIndex: 2, display: 'grid', placeItems: 'center', border: 0, bg: 'none', cursor: 'pointer', color: '#050B14' },
  '.play span': {
    display: 'grid', placeItems: 'center', w: { base: '66px', md: '84px' }, h: { base: '66px', md: '84px' }, borderRadius: '50%',
    bg: C.gold, boxShadow: '0 0 0 10px rgba(212,168,75,0.18)', transition: `transform 160ms ${out}, box-shadow 200ms ease`,
    svg: { w: { base: '24px', md: '30px' }, h: { base: '24px', md: '30px' }, ml: '4px', fill: 'currentColor' },
  },
  '.play:active span': { transform: 'scale(0.94)' },
  '.play:focus-visible span': { outline: '2px solid white', outlineOffset: '4px' },
  '.dur': {
    ...label, position: 'absolute', left: '18px', bottom: '16px', zIndex: 2, fontSize: '12px', letterSpacing: '0.2em',
    bg: 'rgba(5,11,20,0.6)', p: '7px 10px', borderRadius: '8px',
  },
  '.info': { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: { base: '20px', lg: '26px' }, p: { base: '24px 22px', lg: '34px 34px 30px' } },
  '.kk': { ...label, fontSize: '11px', letterSpacing: '0.24em', color: C.gold },
  '.info h3': { mt: '12px', fontFamily: 'heading', fontWeight: 400, fontSize: { base: '40px', lg: 'clamp(40px, 3.6vw, 60px)' }, lineHeight: 0.92, textTransform: 'uppercase' },
  '.club': {
    ...label, display: 'flex', alignItems: 'center', gap: '12px', mt: '16px', fontSize: '14px', letterSpacing: '0.12em', color: C.soft,
    img: { w: '34px', h: '34px', objectFit: 'contain' },
  },
  '.facts': { display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: `1px solid ${C.line}` },
  '.facts div': { pt: '16px' },
  '.facts div + div': { pl: '18px', borderLeft: `1px solid ${C.line}` },
  '.facts b': { display: 'block', fontFamily: 'heading', fontWeight: 400, fontSize: '44px', lineHeight: 1, color: C.acc },
  '.facts small': { ...label, display: 'block', mt: '4px', fontSize: '11px', letterSpacing: '0.2em', color: C.gray },
  // Reels
  '.rh': {
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: { base: '34px', lg: '46px' }, mb: { base: '14px', lg: '18px' },
    b: { ...label, fontSize: '14px', letterSpacing: '0.22em' },
    small: { ...label, fontSize: '12px', letterSpacing: '0.18em', color: C.gray },
  },
  '.reels': {
    listStyle: 'none',
    display: { base: 'flex', md: 'grid' }, gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: { base: '12px', md: '18px' },
    overflowX: { base: 'auto', md: 'visible' }, scrollSnapType: { base: 'x mandatory', md: 'none' },
    mx: { base: '-20px', md: 0 }, px: { base: '20px', md: 0 }, pb: { base: '6px', md: 0 },
    scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' },
  },
  '.reels li': { flex: 'none', w: { base: '68%', md: 'auto' }, scrollSnapAlign: 'center' },
  '.reel': {
    position: 'relative', display: 'block', aspectRatio: '9 / 16', maxH: '560px', w: '100%', borderRadius: '18px', overflow: 'hidden',
    bg: '#000', color: 'white', textDecoration: 'none', transition: `transform 160ms ${out}`,
    '&:active': { transform: 'scale(0.98)' },
    '&:focus-visible': { outline: `2px solid ${C.acc}`, outlineOffset: '3px' },
    '&::after': {
      content: '""', position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, rgba(5,11,20,0.35), transparent 30%, transparent 50%, rgba(5,11,20,0.92))',
    },
  },
  '.reel img': { position: 'absolute', inset: 0, w: '100%', h: '100%', objectFit: 'cover', transition: `transform 500ms ${out}` },
  '.reel .tp': {
    position: 'absolute', top: '14px', left: '14px', right: '14px', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    span: { ...label, fontSize: '11px', letterSpacing: '0.2em', bg: 'rgba(5,11,20,0.55)', p: '6px 9px', borderRadius: '7px' },
    svg: { w: '22px', h: '22px' },
  },
  '.reel .pl': {
    position: 'absolute', left: '50%', top: '50%', zIndex: 2, display: 'grid', placeItems: 'center', w: '58px', h: '58px', m: '-29px 0 0 -29px',
    borderRadius: '50%', bg: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(6px)', transition: `transform 200ms ${out}, background 200ms ease`,
    svg: { ml: '3px', w: '22px', h: '22px', fill: 'currentColor' },
  },
  '.reel .bt': {
    position: 'absolute', left: '16px', right: '16px', bottom: '16px', zIndex: 2,
    b: { display: 'block', fontFamily: 'heading', fontWeight: 400, fontSize: '28px', lineHeight: 1, textTransform: 'uppercase' },
    small: { ...label, display: 'block', mt: '6px', fontSize: '12px', letterSpacing: '0.16em', color: C.soft },
  },
  '.dots': {
    display: { base: 'flex', md: 'none' }, justifyContent: 'center', gap: '6px', mt: '14px',
    i: { w: '6px', h: '6px', borderRadius: '3px', bg: C.line, transition: `width 200ms ${out}, background 200ms ease` },
    'i.on': { w: '18px', bg: C.acc },
  },
  '@media (hover: hover) and (pointer: fine)': {
    '.ig:hover': { borderColor: C.acc },
    '.play:hover span': { transform: 'scale(1.05)', boxShadow: '0 0 0 14px rgba(212,168,75,0.2)' },
    '.player:hover img': { transform: 'scale(1.02)' },
    '.reel:hover img': { transform: 'scale(1.04)' },
    '.reel:hover .pl': { transform: 'scale(1.08)', bg: C.gold, color: '#050B14' },
  },
  '@media (prefers-reduced-motion: reduce)': { '*': { transitionDuration: '0ms !important' } },
}
