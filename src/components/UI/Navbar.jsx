import { useState, useEffect, useRef } from 'react'
import { Box, Flex, Text, HStack, VStack } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'

const MotionBox = motion(Box)

const navLinks = [
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
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      transition="background 0.35s, border-color 0.35s"
      bg={scrolled ? 'rgba(12,7,5,0.88)' : 'transparent'}
      backdropFilter={scrolled ? 'blur(16px)' : 'none'}
      borderBottom={scrolled ? '1px solid rgba(139,69,19,0.25)' : '1px solid transparent'}
      px={{ base: 5, lg: 10 }}
      py={4}
      style={{ opacity: 0 }}
    >
      <Flex align="center" justify="space-between" maxW="1400px" mx="auto">
        {/* Logo */}
        <Text
          fontFamily="heading"
          fontSize="2xl"
          letterSpacing="wider"
          cursor="pointer"
          onClick={(e) => handleLink(e, '#estadisticas')}
          color="white"
          _hover={{ color: 'brand.brown' }}
          transition="color 0.2s"
        >
          RM<Box as="span" color="brand.brown">_</Box>
        </Text>

        {/* Desktop links */}
        <HStack spacing={8} display={{ base: 'none', lg: 'flex' }}>
          {navLinks.map((link) => (
            <Box key={link.href} position="relative" overflow="hidden">
              <Text
                as="a"
                href={link.href}
                onClick={(e) => handleLink(e, link.href)}
                fontFamily="mono"
                fontSize="sm"
                fontWeight="500"
                letterSpacing="wider"
                textTransform="uppercase"
                color="whiteAlpha.700"
                cursor="pointer"
                _hover={{ color: 'white' }}
                transition="color 0.2s"
                _after={{
                  content: '""',
                  position: 'absolute',
                  bottom: '-2px',
                  left: 0,
                  w: 0,
                  h: '1px',
                  bg: 'brand.brown',
                  transition: 'width 0.25s',
                }}
                sx={{ '&:hover::after': { width: '100%' } }}
              >
                {link.label}
              </Text>
            </Box>
          ))}
        </HStack>

        {/* CTA desktop */}
        <Box
          as="a"
          href="#contacto"
          onClick={(e) => handleLink(e, '#contacto')}
          display={{ base: 'none', lg: 'block' }}
          px={5}
          py={2}
          border="1px solid rgba(139,69,19,0.6)"
          fontFamily="mono"
          fontSize="sm"
          fontWeight="600"
          letterSpacing="wider"
          textTransform="uppercase"
          color="brand.brownLight"
          cursor="pointer"
          transition="all 0.2s"
          _hover={{ bg: 'brand.brown', color: 'white', borderColor: 'brand.brown' }}
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            overflow="hidden"
            borderTop="1px solid rgba(139,69,19,0.2)"
            mt={3}
          >
            <VStack align="start" spacing={0} py={4}>
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
                    px={2}
                    borderBottom="1px solid rgba(255,255,255,0.05)"
                    _hover={{ color: 'brand.brown' }}
                    transition="color 0.2s"
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
