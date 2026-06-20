import { useEffect, useRef } from 'react'
import { Box, Flex, Text, HStack, Link } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LiaLaptopCodeSolid } from 'react-icons/lia'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          force3D: false, // avoid a leftover 3D layer that blurs text
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 95%',
            toggleActions: 'play none none none',
            once: true,
          },
          // strip the inline transform once done → text renders crisp
          onComplete: () => gsap.set(ref.current, { clearProps: 'transform' }),
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <Box
      ref={ref}
      as="footer"
      bg="#050810"
      py={16}
      px={{ base: 6, md: 12, lg: 20 }}
       sx={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%)',
        }}
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        justify="space-between"
        flexWrap="wrap"
        gap={4}
      >
        <Box
          as="a"
          href="#hero"
          style={{ textDecoration: 'none' }}
        >
          <Text
            fontFamily="'Bebas Neue', sans-serif"
            fontSize="36px"
            letterSpacing="0.08em"
            color="white"
          >
            RM
            <Box as="span" color="brand.brown" ml="1px">_</Box>
          </Text>
        </Box>

        <Text
          fontFamily="'Barlow Condensed', sans-serif"
          fontSize="12px"
          letterSpacing="0.12em"
          textTransform="uppercase"
          color="whiteAlpha.300"
          textAlign="center"
        >
          © 2026 Ronaldo Martinez · Todos los derechos reservados
        </Text>

        <Text fontSize="12px" color="rgba(255,255,255,0.3)" letterSpacing="0.05em">
            Desarrollo Web -{' '} 
            <Link 
            href="https://matiasgunsett.netlify.app/" 
            isExternal 
            color="#2D5A47" 
            _hover={{ borderColor: '#e8d5a370', color: '#e8d5a380' }}
            transition="color 0.3s"
            >
              Matias Gunsett <LiaLaptopCodeSolid style={{ marginLeft: '4px', display: 'inline-block', verticalAlign: 'middle', fontSize: '20px', color: '#E8D5A3' }} />
            </Link>
          </Text>
      </Flex>
    </Box>
  )
}
