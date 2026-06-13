import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      brown:      '#8B4513',
      brownDark:  '#5C2D0A',
      brownLight: '#C4783E',
      amber:      '#D4A84B',
      dark:       '#0C0705',
      gray:       '#8A7B6E',
      bone:       '#F5EDE0',
      boneWarm:   '#EDE0CC',
    },
  },
  fonts: {
    heading:   `'Bebas Neue', sans-serif`,
    body:      `'Barlow', sans-serif`,
    mono:      `'Barlow Condensed', sans-serif`,
  },
  styles: {
    global: {
      'html, body': {
        bg: '#0C0705',
        color: 'white',
        overflowX: 'hidden',
      },
      '::-webkit-scrollbar': { width: '4px' },
      '::-webkit-scrollbar-track': { bg: '#0C0705' },
      '::-webkit-scrollbar-thumb': { bg: '#8B4513', borderRadius: '2px' },
    },
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
})

export default theme
