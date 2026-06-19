import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrubReveal(sectionRef, config = {}) {
  useEffect(() => {
    if (!sectionRef.current) return

    const {
      elements = [],
      pin = false,
      pinSpacing = true,
      start = 'top 85%',
      end = 'top 25%',
      scrub = 1,
    } = config

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start,
          end,
          scrub,
          pin,
          pinSpacing,
        },
      })

      elements.forEach(({ ref, vars, fromVars, position = '>' }) => {
        if (ref?.current) {
          tl.fromTo(
            ref.current,
            fromVars ?? { y: 50, opacity: 0 },
            vars   ?? { y: 0,  opacity: 1, ease: 'none' },
            position
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])
}

export default useScrubReveal
