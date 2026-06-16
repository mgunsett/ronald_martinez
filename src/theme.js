import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      brown:      '#1E5FA8', // azul principal
      brownDark:  '#0B2A4A', // azul profundo
      brownLight: '#4D93D6', // azul claro
      amber:      '#D4A84B', // dorado para pequeños detalles
      dark:       '#050B14', // azul casi negro (fondo)
      gray:       '#7A8CA3', // azul grisáceo (texto secundario)
      bone:       '#FFFFFF', // blanco (texto principal)
      boneWarm:   '#E6EEF7', // blanco azulado (detalles)
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
        bg: '#050B14',
        color: 'white',
        overflowX: 'hidden',
      },
      '::-webkit-scrollbar': { width: '4px' },
      '::-webkit-scrollbar-track': { bg: '#050B14' },
      '::-webkit-scrollbar-thumb': { bg: '#1E5FA8', borderRadius: '2px' },
    },
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
})

export default theme
