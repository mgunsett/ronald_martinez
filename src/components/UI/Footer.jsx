import { useRef, useEffect } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          clearProps: 'transform',
          scrollTrigger: { trigger: ref.current, start: 'top 95%', once: true },
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <Box
      ref={ref}
      as="footer"
      bg="#0A0604"
      borderTop="1px solid rgba(139,69,19,0.15)"
      py={8}
      px={{ base: 6, lg: 10 }}
    >
      <Flex
        maxW="1400px"
        mx="auto"
        align="center"
        justify="space-between"
        flexDir={{ base: 'column', md: 'row' }}
        gap={3}
      >
        <Text fontFamily="heading" fontSize="xl" color="white" letterSpacing="wider">
          RM<Box as="span" color="brand.brown">_</Box>
        </Text>
        <Text fontFamily="mono" fontSize="xs" color="brand.gray" letterSpacing="wider">
          © 2025 Ronald Martínez. Todos los derechos reservados.
        </Text>
        <Text fontFamily="mono" fontSize="xs" color="brand.gray" letterSpacing="wider">
          Diseño & Desarrollo —{' '}
          <Box as="span" color="brand.brownLight">
            matiasgunsett.com
          </Box>
        </Text>
      </Flex>
    </Box>
  )
}
