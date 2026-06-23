import { FaInstagram, FaEnvelope } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { IoMdStats } from 'react-icons/io'

//Hero
import ronald1 from '@assets/ronald1.webp'
import paraguay from '@assets/paraguay.webp'
import talleres from '@assets/talleres.webp'
//Escudos trayectoria
import escudoTalleres from '@assets/escudos/escudo_talleres.webp'
import escudoPlatense from '@assets/escudos/escudo_platense.webp'
import escudoResistencia from '@assets/escudos/escudo_resistencia.webp'
import escudoStrongest from '@assets/escudos/escudo_strongest.webp'
import escudoCentralNorte from '@assets/escudos/escudo_central_norte.webp'
import escudoCapiata from '@assets/escudos/escudo_capiata.webp'
import escudoCerro from '@assets/escudos/escudo_cerro.webp'
import escudoParaguay from '@assets/escudos/escudo_paraguay.webp'
//Gallery
import image1 from '@assets/gallery/image1.webp'
import image2 from '@assets/gallery/image2.webp'
import image3 from '@assets/gallery/image3.webp'
import image4 from '@assets/gallery/image4.webp'
import image5 from '@assets/gallery/image5.webp'
import image6 from '@assets/gallery/image6.webp'
//Video
import photoGraph from '@assets/perfil_video.webp'
//Prensa
import logo1 from '@assets/logos/logo1.webp'
import logo2 from '@assets/logos/logo2.webp'
import logo3 from '@assets/logos/logo3.webp'
//Redes
import transfermkt from '@assets/contact2.svg'
import ledsports from '@assets/contact3.webp'


export const playerData = {
  name: 'RONALDO',
  fullName: 'MARTINEZ',
  number: 77,
  position: 'Delantero',
  positionShort: 'DEL',
  nationality: 'Paraguay',
  nationalityFlag: paraguay,
  age: 30,
  height: '1.78m',
  weight: '68kg',
  foot: 'Derecho',
  birthDate: '25 / 04 / 1996',
  birthPlace: 'Eusebio Ayala, Paraguay',
  currentClub: 'Talleres',
  logoCurrentClub: talleres,
  image: ronald1,

  stats: [
    { label: 'Velocidad',      value: 91 },
    { label: 'Definición',     value: 88 },
    { label: 'Regate',         value: 84 },
    { label: 'Juego Aéreo',    value: 75 },
    { label: 'Presión Alta',   value: 82 },
    { label: 'Visión de Juego',value: 79 },
  ],

  seasonStats: [
    { label: 'Partidos',    value: 19 },
    { label: 'Goles',       value: 3 },
    { label: 'Asistencias', value: 2  },
    { label: 'Tiros al árco', value: 28  },
    { label: 'Min / Part.', value: "1,470'" },
    { label: 'Valoración', value: 7.4  },

  ],

  clubs: [
    {
      name:    'Talleres',
      country: 'Argentina',
      years:   '2025 — Actualidad',
      logo:    escudoTalleres,
      titles:  [],
      info:    '',
    },
    {
      name:    'Seleccion Mayor',
      country: 'Paraguay',
      years:   '2024 — 2026',
      logo:    escudoParaguay,
      titles:  [],
      info:    '',
    },
    {
      name:    'Platense',
      country: 'Argentina',
      years:   '2024 — 2025',
      logo:    escudoPlatense,
      titles:  ['Torneo Apertura 2025'],
      info:    'Goleador del Torneo',
    },
    {
      name:    'Resistencia SC',
      country: 'Paraguay',
      years:   '2022',
      logo:    escudoResistencia,
      titles:  [],
      info:    '',
    },
    {
      name:    'The Strongest',
      country: 'Bolivia',
      years:   '2021',
      logo:    escudoStrongest,
      titles:  [],
      info:    'Préstamo',
    },
    {
      name:    'Central Norte',
      country: 'Argentina',
      years:   '2019',
      logo:    escudoCentralNorte,
      titles:  ['Torneo Regional Federal 2019'],
      info:    'Préstamo',
    },
    {
      name:    'Capiatá',
      country: 'Paraguay',
      years:   '2018',
      logo:    escudoCapiata,
      titles:  [],
      info:    'Préstamo',
    },
    {
      name:    'Cerro Porteño',
      country: 'Paraguay',
      years:   '2015 — 2021',
      logo:    escudoCerro,
      titles:  ['Torneo Apertura 2015', 'Torneo Clausura 2017', 'Torneo Apertura 2020'],
      info:    'Debut profesional ',
    },
  ],

  videos: [
    {
      id: 'v1',
      title: 'Platense 2025',
      fullTitle: 'Ronaldo Martinez | Platense 2025 [Highlights]',
      youtubeId: 'HAr4MZtD7sY',
      duration: '4:01',
      season: 'Temporada',
      league: 'Liga Argentina',
      thumbnail: photoGraph,
      cover: photoGraph,
      category: 'Highlights',
    },
  ],

  press: [
    {
      media: 'El Gráfico',
      logo:  logo1,
      title: 'Se ha inmortalizado en los libros de récords al convertirse en el máximo goleador del Torneo Clausura 2025',
      date:  'Diciembre 2025',
      url:   'https://www.elgrafico.com.ar/articulo/primera-division/95962/cuantas-veces-platense-tuvo-al-goleador-del-campeonato-de-primera-division',
    },
    {
      media: 'La Voz',
      logo:  logo2,
      title: 'El delantero paraguayo puso el 1-0 y fue clave en la noche feliz de la “T” ante Newell’s.',
      date:  'Enero 2026',
      url:   'https://www.lavoz.com.ar/deportes/futbol/ronaldo-martinez-figura-de-talleres-como-esta-de-la-lesion-y-por-que-festejo-a-lo-cristiano/',
    },
    {
      media: 'Cba24N',
      logo:  logo3,
      title: 'Convocado por la selección de Paraguay para participar en la próxima ventana internacional de la fecha FIFA',
      date:  'Marzo 2026',
      url:   'https://www.cba24n.com.ar/deportes/futbol/talleres/ronaldo-martinez--convocado-a-la-seleccion-de-paraguay-para-la-proxima-ventana-internacional_a69ac304f2128774661b1005d',
    },
  ],

  gallery: [
    { id: 1, src: image1, alt: 'Ronaldo Martínez disputando la pelota en la Liga Profesional 2024', caption: 'Liga Profesional 2024', category: 'Partido', aspect: 'wide' },
    { id: 2, src: image2, alt: 'Ronaldo Martínez celebrando un gol ante Racing',                   caption: 'Festejo ante Racing',    category: 'Festejo', aspect: 'tall' },
    { id: 3, src: image3, alt: 'Ronaldo Martínez durante el entrenamiento de pretemporada 2025',    caption: 'Pretemporada 2025',       category: 'Entrenamiento', aspect: 'square' },
    { id: 4, src: image4, alt: 'Ronaldo Martínez en partido de Copa Argentina 2024',                caption: 'Copa Argentina 2024',     category: 'Partido', aspect: 'wide' },
    { id: 5, src: image5, alt: 'Ronaldo Martínez junto al plantel de Talleres 2024',                caption: 'Plantel Talleres 2024',   category: 'Equipo',  aspect: 'wide' },
    { id: 6, src: image6, alt: 'Ronaldo Martínez en sesión fotográfica oficial 2024',               caption: 'Foto oficial 2024',       category: 'Retrato', aspect: 'tall' },
  ],

  socialMedia: [
    {
      label: 'Instagram',
      icon: FaInstagram,
      iconBg: FaInstagram,
      handle: '@ronaldoivan',
      url: 'https://www.instagram.com/ronaldoivan/',
      hoverColor: '#E1306C',
      hoverGradient: 'insta-gradient',
    },
    {
      label: 'TransferMarkt',
      image: transfermkt,
      iconBg: IoMdStats,
      handle: '@ronaldo-martinez',
      url: 'https://www.transfermarkt.com.ar/ronaldo-martinez/profil/spieler/567736',
      hoverColor: 'brand.brownLight',
    },
  ],

  contact: [
    {
      title:      'Representante Deportivo',
      label:      'Universal Twenty Two',
      icon:       FaEnvelope,
      handle:     '@twentytwo_sm',
      url:        'https://www.instagram.com/twentytwo_sm/',
      hoverColor: 'rgba(139,69,19,0.18)',
    },
    {
      title:      'Contacto Marketing',
      label:      'led sports marketing',
      image: ledsports,
      handle:     '@_ledsports',
      url:        'https://www.instagram.com/_ledsports/',
      hoverColor: 'rgba(212,168,75,0.18)',
    },
  ],
}
