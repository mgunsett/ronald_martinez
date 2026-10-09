import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { AnimatePresence, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { keyframes } from '@emotion/react'

import { useTournamentGallery } from '../../hooks/useTournamentGallery'
import { GalleryGlow, GalleryHeader } from './GalleryHeader'
import Lightbox from './Lightbox'
import { pad2, useIsMobile } from './galleryUtils'

gsap.registerPlugin(ScrollTrigger)

/**
 * GALERÍA "RECORRIDO" (propuesta 3B, versión retocada)
 *
 * Desktop: la sección queda fija y el scroll recorre en horizontal las 3
 * galerías, pero más rápido: fotos angostas y solo MAX_VISIBLE por galería.
 * Al final de cada galería, una tarjeta "+N fotos" abre todas en grande.
 * Arriba, las galerías quedan siempre a la vista como botones ("Saltar a"),
 * con el avance de cada una. Cada capítulo abre con su título en vertical.
 *
 * Mobile (diseño propio): sin fijado. Pastillas fijas arriba para ir a cada
 * galería y una fila deslizable por galería, con puntos de avance, "Ver
 * todas" y la tarjeta "+N fotos".
 *
 * @param {number} maxVisible  fotos por galería en el recorrido (3 o 4)
 * @param {string} stickyTop   altura a la que quedan fijas las pastillas en
 *                             mobile (debajo del navbar flotante)
 */

const PX = { base: 5, lg: 10 }
const nudge = keyframes`0%, 100% { transform: translateX(0); } 50% { transform: translateX(6px); }`

const RM_ = (
  <Text as="span" fontFamily="heading" fontSize="xl" letterSpacing="wider">
    RM
    <Box as="span" color="brand.brown">
      _
    </Box>
  </Text>
)

// ─── FOTO ─────────────────────────────────────────────────────────
function PhotoCard({ t, photo, index, onOpen, mobile }) {
  return (
    <Box
      as="button"
      type="button"
      data-frame
      role="group"
      onClick={() => onOpen(t, index)}
      aria-label={`${photo.caption}. Ampliar foto ${index + 1} de ${t.photos.length}`}
      position="relative"
      flex="0 0 auto"
      w={mobile ? '64vw' : 'clamp(180px, 14.5vw, 240px)'}
      h={mobile ? 'auto' : '100%'}
      borderRadius="10px"
      overflow="hidden"
      border="1px solid"
      borderColor="whiteAlpha.100"
      boxShadow="0 24px 60px rgba(0,0,0,0.45)"
      cursor="zoom-in"
      transition="border-color .4s, transform .5s cubic-bezier(.22,1,.36,1)"
      sx={mobile ? { aspectRatio: '4 / 5', scrollSnapAlign: 'start' } : undefined}
      _hover={mobile ? undefined : { borderColor: 'rgba(30,95,168,0.6)', transform: 'translateY(-6px)' }}
      _focusVisible={{ outline: '2px solid', outlineColor: 'brand.brownLight', outlineOffset: '3px' }}
    >
      <Image
        data-parallax
        src={photo.src}
        alt=""
        draggable={false}
        position="absolute"
        top={0}
        left={mobile ? 0 : '-15%'}
        w={mobile ? '100%' : '130%'}
        maxW="none"
        h="100%"
        objectFit="cover"
      />
      <Box position="absolute" inset={0} bg="rgba(5,11,20,0.55)" opacity={mobile ? 0 : 0.3} transition="opacity .45s" _groupHover={{ opacity: 0 }} pointerEvents="none" />
      <Box position="absolute" inset={0} pointerEvents="none" background="linear-gradient(to top, rgba(3,6,10,0.92) 0%, transparent 42%, rgba(3,6,10,0.2) 100%)" />
      <Flex
        position="absolute"
        left={0}
        right={0}
        bottom={0}
        p="14px"
        justify="space-between"
        align="flex-end"
        gap={2}
        opacity={mobile ? 1 : 0}
        transform={mobile ? 'none' : 'translateY(12px)'}
        transition="opacity .45s ease, transform .45s ease"
        _groupHover={{ opacity: 1, transform: 'none' }}
      >
        {RM_}
      </Flex>
    </Box>
  )
}

// ─── TARJETA "+N FOTOS" ───────────────────────────────────────────
function MoreCard({ t, maxVisible, onOpen, mobile }) {
  const n = t.photos.length
  const extra = n - maxVisible
  const rest = extra > 0 ? t.photos.slice(maxVisible) : t.photos
  const stack = [rest[0], rest[1] ?? t.photos[0], rest[2] ?? rest[0]]
  return (
    <Box
      as="button"
      type="button"
      role="group"
      onClick={() => onOpen(t, extra > 0 ? maxVisible : 0)}
      aria-label={extra > 0 ? `Ver ${extra} fotos más de ${t.name}` : `Ver ${t.name} en grande`}
      position="relative"
      flex="0 0 auto"
      w={mobile ? '42vw' : 'clamp(160px, 12vw, 200px)'}
      h={mobile ? 'auto' : '100%'}
      display="flex"
      flexDirection="column"
      justifyContent="flex-end"
      gap="6px"
      p="18px"
      textAlign="left"
      borderRadius="10px"
      border="1px dashed rgba(77,147,214,0.45)"
      bg="linear-gradient(180deg, rgba(30,95,168,0.10), rgba(30,95,168,0.02))"
      transition="background .3s, border-color .3s"
      sx={mobile ? { scrollSnapAlign: 'start' } : undefined}
      _hover={{ borderStyle: 'solid', borderColor: 'brand.brown', bg: 'rgba(30,95,168,0.2)' }}
      _focusVisible={{ outline: '2px solid', outlineColor: 'brand.brownLight', outlineOffset: '3px' }}
    >
      <Box position="absolute" left="50%" top="22%" w="56%" transform="translateX(-50%)" sx={{ aspectRatio: '3 / 4' }} aria-hidden="true">
        {stack.map((p, i) => (
          <Image
            key={i}
            src={p.src}
            alt=""
            position="absolute"
            inset={0}
            w="100%"
            h="100%"
            objectFit="cover"
            borderRadius="8px"
            border="2px solid"
            borderColor="brand.dark"
            boxShadow="0 10px 30px rgba(0,0,0,0.5)"
            filter={i === 0 ? 'brightness(.55)' : i === 1 ? 'brightness(.7)' : 'none'}
            transform={i === 0 ? 'rotate(-9deg) translateX(-14%)' : i === 1 ? 'rotate(6deg) translateX(12%)' : 'none'}
            transition="transform .5s cubic-bezier(.32,1.15,.42,1)"
            _groupHover={i === 0 ? { transform: 'rotate(-16deg) translateX(-30%)' } : i === 1 ? { transform: 'rotate(12deg) translateX(28%)' } : undefined}
          />
        ))}
      </Box>
      <Text fontFamily="heading" fontSize={mobile ? '38px' : '44px'} lineHeight={0.9} position="relative">
        {extra > 0 ? (
          <>
            <Box as="span" color="brand.amber">
              +{extra}
            </Box>
            <br />
            FOTOS
          </>
        ) : (
          <>
            VER +
          </>
        )}
      </Text>
    </Box>
  )
}

// ─── DESKTOP ──────────────────────────────────────────────────────
function DesktopRecorrido({ tournaments, maxVisible, onOpen, reduced }) {
  const [active, setActive] = useState(0)
  const pinRef = useRef(null)
  const trackRef = useRef(null)
  const chapterRefs = useRef([])
  const tabRefs = useRef([])
  const tweenRef = useRef(null)
  const activeRef = useRef(0)

  const maxX = () => {
    const tr = trackRef.current
    return tr ? Math.max(1, tr.scrollWidth - tr.clientWidth) : 1
  }
  const range = (k) => {
    const tr = trackRef.current
    const half = tr.clientWidth * 0.5
    const ch = chapterRefs.current
    const s = k === 0 ? 0 : ch[k].offsetLeft - tr.offsetLeft - half
    const e = k === ch.length - 1 ? maxX() : ch[k + 1].offsetLeft - tr.offsetLeft - half
    return [Math.max(0, s), Math.max(1, e)]
  }

  const update = useCallback(() => {
    const tr = trackRef.current
    if (!tr || !chapterRefs.current.length) return
    const p = -gsap.getProperty(tr, 'x')
    let a = 0
    tabRefs.current.forEach((tab, k) => {
      if (!tab) return
      const [s, e] = range(k)
      tab.style.setProperty('--p', gsap.utils.clamp(0, 1, (p - s) / (e - s)))
      if (p >= s - 1) a = k
    })
    if (a !== activeRef.current) {
      activeRef.current = a
      setActive(a)
    }
    const vw = window.innerWidth
    tr.querySelectorAll('[data-frame]').forEach((f) => {
      const r = f.getBoundingClientRect()
      gsap.set(f.querySelector('[data-parallax]'), { x: ((r.left + r.width / 2 - vw / 2) / vw) * -50 })
    })
    // range y maxX solo leen refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    const tr = trackRef.current
    if (!tr) return undefined
    const ctx = gsap.context(() => {
      tweenRef.current = gsap.to(tr, {
        x: () => -maxX(),
        ease: 'none',
        onUpdate: update,
        scrollTrigger: { trigger: pinRef.current, pin: true, start: 'top top', end: () => `+=${maxX()}`, scrub: 0.6, invalidateOnRefresh: true },
      })
    }, pinRef)
    update()
    return () => {
      ctx.revert()
      tweenRef.current = null
    }
  }, [tournaments, update])

  // Las fotos cargan después del primer render: re-medir el recorrido
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => clearTimeout(id)
  }, [tournaments])

  const goTo = (k) => {
    const tr = trackRef.current
    const st = tweenRef.current?.scrollTrigger
    if (!st) return
    const [s] = range(k)
    const pad = parseFloat(getComputedStyle(tr).paddingLeft) || 0
    const target = k === 0 ? 0 : Math.min(maxX(), Math.max(s + 2, chapterRefs.current[k].offsetLeft - tr.offsetLeft - pad))
    const y = st.start + (target / maxX()) * (st.end - st.start)
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: reduced ? 0 : 1.2 })
    else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' })
  }

  const onTabKey = (e, k) => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
    if (!d) return
    e.preventDefault()
    const n = (k + d + tournaments.length) % tournaments.length
    tabRefs.current[n]?.focus()
    goTo(n)
  }

  const cur = tournaments[active] ?? tournaments[0]

  return (
    <Flex ref={pinRef} direction="column" justify="center" position="relative" overflow="hidden" h="100vh" py={10}>
      <GalleryGlow />
      <GalleryHeader  mb={4} />

      <Box maxW="1400px" mx="auto" px={PX} w="100%" position="relative">
        {/* Galerías siempre a la vista: avance + salto directo */}
        <Flex role="tablist" gap="10px" mb={6}>
          {tournaments.map((t, k) => {
            const on = k === active
            return (
              <Box
                key={t.id}
                as="button"
                type="button"
                role="tab"
                aria-selected={on}
                tabIndex={on ? 0 : -1}
                ref={(el) => (tabRefs.current[k] = el)}
                onClick={() => goTo(k)}
                onKeyDown={(e) => onTabKey(e, k)}
                position="relative"
                flex={1}
                minW={0}
                display="flex"
                flexDirection="column"
                gap={1}
                pt={4}
                pb={4}
                px="18px"
                textAlign="left"
                borderRadius="8px"
                border="1px solid"
                borderColor={on ? 'brand.brown' : 'whiteAlpha.200'}
                bg={on ? 'rgba(30,95,168,0.14)' : 'rgba(255,255,255,0.02)'}
                overflow="hidden"
                transition="background .3s, border-color .3s, transform .3s"
                _hover={on ? undefined : { borderColor: 'brand.brownLight', transform: 'translateY(-2px)', '& .tab-name': { color: 'white' }, '& .tab-go': { bg: 'brand.brown', borderColor: 'brand.brown' } }}
                _focusVisible={{ outline: '2px solid', outlineColor: 'brand.brownLight', outlineOffset: '3px' }}
              >
                
                <Flex className="tab-name" align="center" justify="space-between" gap={2} fontFamily="heading" fontSize="clamp(26px, 2.6vw, 28px)" lineHeight={1} letterSpacing="0.02em" textTransform="uppercase" color={on ? 'white' : 'whiteAlpha.600'} transition="color .3s">
                  {t.name}
                  <Flex
                    as="span"
                    className="tab-go"
                    boxSize="30px"
                    flexShrink={0}
                    align="center"
                    justify="center"
                    borderRadius="full"
                    border="1px solid"
                    borderColor="whiteAlpha.200"
                    fontSize="24px"
                    opacity={on ? 0 : 1}
                    transition="all .3s"
                    aria-hidden="true"
                  >
                    ›
                  </Flex>
                </Flex>
                <Box
                  position="absolute"
                  left={0}
                  right={0}
                  bottom={0}
                  h="3px"
                  bg="whiteAlpha.100"
                  _after={{ content: '""', position: 'absolute', inset: 0, bg: 'brand.brown', boxShadow: '0 0 12px rgba(30,95,168,0.8)', transform: 'scaleX(var(--p, 0))', transformOrigin: 'left' }}
                />
              </Box>
            )
          })}
        </Flex>
      </Box>

      <Flex ref={trackRef} align="stretch" gap="14px" h="min(50vh, 470px)" px={PX} sx={{ willChange: 'transform' }}>
        {tournaments.map((t, k) => [
          <Flex
            key={`ch-${t.id}`}
            ref={(el) => (chapterRefs.current[k] = el)}
            align="flex-end"
            flex="0 0 auto"
            pl={k === 0 ? 0 : '18px'}
            pr="4px"
            borderLeft={k === 0 ? 'none' : '1px solid'}
            borderColor="whiteAlpha.100"
          >
            {/* Título vertical, leído de abajo hacia arriba */}
            <Text
              as="h3"
              fontFamily="heading"
              fontSize="clamp(56px, 6vw, 96px)"
              lineHeight={0.86}
              textTransform="uppercase"
              whiteSpace="nowrap"
              sx={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              {t.name}
              <Box as="span" color="brand.brown">
                _
              </Box>
            </Text>
          </Flex>,
          ...t.photos.slice(0, maxVisible).map((p, i) => <PhotoCard key={p.id} t={t} photo={p} index={i} onOpen={onOpen} />),
          <MoreCard key={`more-${t.id}`} t={t} maxVisible={maxVisible} onOpen={onOpen} />,
        ])}
      </Flex>
    </Flex>
  )
}

// ─── MOBILE ───────────────────────────────────────────────────────
function MobileRow({ t, first, maxVisible, onOpen, rowRef }) {
  const swipeRef = useRef(null)
  const [dot, setDot] = useState(0)
  const [touched, setTouched] = useState(false)
  const count = Math.min(maxVisible, t.photos.length) + 1

  const onScroll = () => {
    const sw = swipeRef.current
    const w = (sw.firstElementChild?.offsetWidth ?? 1) + 10
    setDot(Math.min(count - 1, Math.round(sw.scrollLeft / w)))
    if (!touched) setTouched(true)
  }

  return (
    <Box ref={rowRef} data-row={t.id} pt="22px" pb={2}>
      <Flex align="flex-end" justify="space-between" gap={3} px={5} mb={3}>
        <Box>
          <Text as="h3" fontFamily="heading" fontSize="44px" lineHeight={0.9} textTransform="uppercase">
            {t.name}
            <Box as="span" color="brand.brown">
              _
            </Box>
          </Text>
          <Text mt={1} fontFamily="mono" fontSize="11px" letterSpacing="0.16em" textTransform="uppercase" color="brand.gray">
            <Box as="span" color="brand.amber" fontWeight="600">
              {pad2(t.photos.length)}
            </Box>{' '}
            fotos
          </Text>
        </Box>
        <Box
          as="button"
          type="button"
          onClick={() => onOpen(t, 0)}
          flexShrink={0}
          h="36px"
          px="14px"
          borderRadius="full"
          border="1px solid"
          borderColor="brand.brown"
          bg="rgba(30,95,168,0.14)"
          fontFamily="mono"
          fontSize="11px"
          fontWeight="600"
          letterSpacing="0.14em"
          textTransform="uppercase"
        >
          Ver todas
        </Box>
      </Flex>

      <Flex
        ref={swipeRef}
        onScroll={onScroll}
        gap="10px"
        overflowX="auto"
        px={5}
        pb="6px"
        sx={{ scrollSnapType: 'x mandatory', scrollPaddingInline: '20px', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
      >
        {t.photos.slice(0, maxVisible).map((p, i) => (
          <PhotoCard key={p.id} t={t} photo={p} index={i} onOpen={onOpen} mobile />
        ))}
        <MoreCard t={t} maxVisible={maxVisible} onOpen={onOpen} mobile />
      </Flex>

      <Flex gap="5px" px={5} pt="10px" aria-hidden="true">
        {Array.from({ length: count }, (_, j) => (
          <Box key={j} h="6px" w={j === dot ? '20px' : '6px'} borderRadius="3px" bg={j === dot ? 'brand.brown' : 'whiteAlpha.300'} transition="all .3s" />
        ))}
      </Flex>
      {first && !touched && (
        <Flex align="center" gap={2} px={5} pt={1} fontFamily="mono" fontSize="11px" letterSpacing="0.14em" textTransform="uppercase" color="brand.gray">
          Deslizá para ver más
          <Box as="span" color="brand.brownLight" fontSize="16px" animation={`${nudge} 1.4s ease-in-out infinite`}>
            ›
          </Box>
        </Flex>
      )}
    </Box>
  )
}

function MobileRecorrido({ tournaments, maxVisible, onOpen, stickyTop, reduced }) {
  const [active, setActive] = useState(0)
  const [pinned, setPinned] = useState(false)
  const rowRefs = useRef([])
  const lock = useRef(0)
  const sectionRef = useRef(null)
  const slotRef = useRef(null)

  // Pastillas fijas arriba mientras la galería está en pantalla. Se hace por
  // código (no con position: sticky) porque el sitio usa overflowX="hidden"
  // en <main> y en el body, y eso anula el sticky.
  useEffect(() => {
    const top = parseFloat(stickyTop) || 0
    const onScroll = () => {
      const slot = slotRef.current
      const sec = sectionRef.current
      if (!slot || !sec) return
      const r = slot.getBoundingClientRect()
      const s = sec.getBoundingClientRect()
      setPinned(r.top <= top && s.bottom > top + r.height + 40)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [stickyTop])

  // Pastilla activa según la fila que está en pantalla
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting || Date.now() < lock.current) return
          setActive(rowRefs.current.indexOf(e.target))
        }),
      { rootMargin: '-35% 0px -60% 0px' },
    )
    rowRefs.current.forEach((r) => r && io.observe(r))
    return () => io.disconnect()
  }, [tournaments])

  const goTo = (k) => {
    lock.current = Date.now() + 1200
    setActive(k)
    const el = rowRefs.current[k]
    const offset = (parseFloat(stickyTop) || 0) + 64
    const y = el.getBoundingClientRect().top + window.scrollY - offset
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: reduced ? 0 : 1 })
    else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <Box ref={sectionRef} py="48px" pb="40vh" position="relative">
      <GalleryGlow />
      <GalleryHeader meta={`${pad2(tournaments.length)} galerías`} mb={4} />
      {/* El hueco conserva el alto de la barra cuando pasa a estar fija */}
      <Box ref={slotRef} h="61px" mb="6px">
      <Flex
        role="tablist"
        aria-label="Ir a una galería"
        position={pinned ? 'fixed' : 'relative'}
        top={pinned ? stickyTop : undefined}
        left={pinned ? 0 : undefined}
        right={pinned ? 0 : undefined}
        zIndex={20}
        gap="6px"
        px={5}
        py="10px"
        bg="rgba(5,11,20,0.82)"
        backdropFilter="blur(12px)"
        borderBottom="1px solid"
        borderColor="whiteAlpha.100"
      >
        {tournaments.map((t, k) => {
          const on = k === active
          return (
            <Box
              key={t.id}
              as="button"
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => goTo(k)}
              flex={1}
              minW={0}
              h="40px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap="5px"
              borderRadius="full"
              border="1px solid"
              borderColor={on ? 'brand.brown' : 'whiteAlpha.200'}
              bg={on ? 'brand.brown' : 'transparent'}
              color={on ? 'white' : 'whiteAlpha.700'}
              fontFamily="heading"
              fontSize="17px"
              letterSpacing="0.03em"
              textTransform="uppercase"
              transition="background .25s, border-color .25s, color .25s"
            >
              {t.name}
              <Text as="span" fontFamily="mono" fontSize="10px" fontWeight="600" color={on ? 'white' : 'brand.amber'}>
                {pad2(t.photos.length)}
              </Text>
            </Box>
          )
        })}
      </Flex>
      </Box>
      {tournaments.map((t, k) => (
        <MobileRow key={t.id} t={t} first={k === 0} maxVisible={maxVisible} onOpen={onOpen} rowRef={(el) => (rowRefs.current[k] = el)} />
      ))}
    </Box>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────
export function GalleryRecorrido({ maxVisible = 3, stickyTop = '76px' }) {
  const { tournaments } = useTournamentGallery()
  const isMobile = useIsMobile()
  const reduced = useReducedMotion()
  const [lightbox, setLightbox] = useState(null) // { t, i }

  const onOpen = useCallback((t, i) => setLightbox({ t, i }), [])
  const closeLb = useCallback(() => setLightbox(null), [])
  const stepLb = useCallback((d) => setLightbox((l) => ({ ...l, i: (l.i + d + l.t.photos.length) % l.t.photos.length })), [])
  const prevLb = useCallback(() => stepLb(-1), [stepLb])
  const nextLb = useCallback(() => stepLb(1), [stepLb])

  if (!tournaments.length) return null

  return (
    <Box as="section" id="galeria" aria-label="Galería de fotos por sección" bg="brand.dark" position="relative" sx={{ overflow: 'clip' }}>
      {isMobile || reduced ? (
        <MobileRecorrido tournaments={tournaments} maxVisible={maxVisible} onOpen={onOpen} stickyTop={stickyTop} reduced={reduced} />
      ) : (
        <DesktopRecorrido tournaments={tournaments} maxVisible={maxVisible} onOpen={onOpen} reduced={reduced} />
      )}
      <AnimatePresence>
        {lightbox && <Lightbox images={lightbox.t.photos} label={lightbox.t.name} index={lightbox.i} onClose={closeLb} onPrev={prevLb} onNext={nextLb} />}
      </AnimatePresence>
    </Box>
  )
}

export default GalleryRecorrido
