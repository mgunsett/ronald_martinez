import { useState, useEffect, useRef } from 'react'
import { Box, Flex, Text, HStack, VStack } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'

const MotionBox = motion(Box)

const navLinks = [
  { label: 'Home', href: '#hero'},
  { label: 'Estadísticas', href: '#estadisticas' },
  { label: 'Videos',       href: '#videos' },
  { label: 'Galería',      href: '#galeria' },
  { label: 'Prensa',       href: '#prensa' },
  { label: 'Contacto',     href: '#contacto' },
]

function scrollTo(href) {
  const target = document.querySelector(href)
  if (!target) return
  if (window.__lenis) {
    window.__lenis.scrollTo(target, { offset: -80 })
  } else {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const navRef                    = useRef(null)

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', delay: 0.5 }
    )
  }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleLink = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    scrollTo(href)
  }

  return (
    <Box
      ref={navRef}
      as="nav"
      position="fixed"
      top={{ base: 3, lg: 3 }}
      left={0}
      right={0}
      zIndex={1000}
      px={{ base: 4, lg: 4 }}
      style={{ opacity: 0 }}
    >
      <Flex
        align="center"
        justify="space-between"
        maxW="1400px"
        mx="auto"
        px={{ base: 4, lg: 7 }}
        py={{ base: 2.5, lg: 2 }}
        borderRadius={{ base: '18px', lg: '15px' }}
        border="1px solid"
        borderColor={scrolled ? 'rgba(77,147,214,0.30)' : 'rgba(255,255,255,0.12)'}
        bg={scrolled ? 'rgba(5,11,20,0.55)' : 'rgba(255,255,255,0.04)'}
        backdropFilter="blur(20px) saturate(140%)"
        boxShadow={scrolled
          ? '0 10px 34px rgba(0,0,0,0.40)'
          : '0 6px 26px rgba(0,0,0,0.22)'}
        transition="background 0.35s, border-color 0.35s, box-shadow 0.35s"
      >
        {/* Logo */}
        <Text
          fontFamily="heading"
          fontSize="2xl"
          letterSpacing="wider"
          cursor="pointer"
          onClick={(e) => handleLink(e, '#hero')}
          color="white"
          _hover={{ color: 'brand.brown' }}
          transition="color 0.2s"
        >
          RM<Box as="span" color="brand.brown">_</Box>
        </Text>

        {/* Desktop links */}
        <HStack spacing={1} display={{ base: 'none', lg: 'flex' }}>
          {navLinks.map((link) => (
            <Text
              key={link.href}
              as="a"
              href={link.href}
              onClick={(e) => handleLink(e, link.href)}
              position="relative"
              px={4}
              py={2}
              borderRadius="10px"
              fontFamily="mono"
              fontSize="sm"
              fontWeight="500"
              letterSpacing="wider"
              textTransform="uppercase"
              color="whiteAlpha.700"
              cursor="pointer"
              transition="color 0.25s"
              _before={{
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: '10px',
                bg: 'linear-gradient(135deg, rgba(77,147,214,0.22) 0%, rgba(30,95,168,0.10) 100%)',
                opacity: 0,
                transform: 'scale(0.92)',
                transition: 'opacity 0.25s, transform 0.25s',
                pointerEvents: 'none',
              }}   
              _hover={{
                color: 'white',
                _before: { opacity: 1, transform: 'scale(1)' },
                _after: { width: '40%' },
              }}
            >
              <Box as="span" position="relative" zIndex={1}>
                {link.label}
              </Box>
            </Text>
          ))}
        </HStack>

        {/* CTA desktop */}
        <Box
          as="a"
          href="#contacto"
          onClick={(e) => handleLink(e, '#contacto')}
          display={{ base: 'none', lg: 'block' }}
          px={'12px'}
          py={'7px'}
          border="1px solid"
          borderColor= 'brand.brown'
          borderRadius={'8px'}
          fontFamily="mono"
          fontSize="sm"
          fontWeight="600"
          letterSpacing="wider"
          textTransform="uppercase"
          color="brand.brownLight"
          cursor="pointer"
          transition="all 0.2s"
          _hover={{ bg: 'brand.brown', color: 'white' }}
        >
          Contacto
        </Box>

        {/* Hamburger mobile */}
        <Box
          display={{ base: 'flex', lg: 'none' }}
          flexDir="column"
          gap="5px"
          cursor="pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          p={2}
        >
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              w="22px"
              h="1.5px"
              bg="white"
              transition="all 0.25s"
              transform={
                menuOpen
                  ? i === 0 ? 'rotate(45deg) translate(4.5px, 4.5px)'
                  : i === 1 ? 'scaleX(0)'
                  : 'rotate(-45deg) translate(4.5px, -4.5px)'
                  : 'none'
              }
            />
          ))}
        </Box>
      </Flex>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <MotionBox
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            display={{ base: 'block', lg: 'none' }}
            maxW="1400px"
            mx="auto"
            mt={3}
            borderRadius="18px"
            border="1px solid rgba(255,255,255,0.12)"
            bg="rgba(5,11,20,0.65)"
            backdropFilter="blur(20px) saturate(140%)"
            boxShadow="0 10px 34px rgba(0,0,0,0.40)"
            overflow="hidden"
          >
            <VStack align="stretch" spacing={0} py={2} px={2}>
              {navLinks.map((link, i) => (
                <MotionBox
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  w="full"
                >
                  <Text
                    as="a"
                    href={link.href}
                    onClick={(e) => handleLink(e, link.href)}
                    display="block"
                    fontFamily="mono"
                    fontSize="lg"
                    fontWeight="600"
                    letterSpacing="wider"
                    textTransform="uppercase"
                    color="whiteAlpha.800"
                    py={3}
                    px={3}
                    borderRadius="12px"
                    _hover={{ color: 'brand.brown', bg: 'whiteAlpha.50' }}
                    transition="color 0.2s, background 0.2s"
                    cursor="pointer"
                  >
                    {link.label}
                  </Text>
                </MotionBox>
              ))}
            </VStack>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  )
}
