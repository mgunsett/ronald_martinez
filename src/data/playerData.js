import { FaInstagram, FaEnvelope } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { IoMdStats } from 'react-icons/io'

//Hero
import ronald1 from '@assets/ronald1.png'
import paraguay from '@assets/paraguay.webp'
import talleres from '@assets/talleres.png'

//Escudos trayectoria
import escudoTalleres from '@assets/escudos/escudo_talleres.webp'
import escudoPlatense from '@assets/escudos/escudo_platense.webp'
import escudoResistencia from '@assets/escudos/escudo_resistencia.webp'
import escudoStrongest from '@assets/escudos/escudo_strongest.webp'
import escudoCentralNorte from '@assets/escudos/escudo_central_norte.webp'
import escudoCapiata from '@assets/escudos/escudo_capiata.webp'
import escudoCerro from '@assets/escudos/escudo_cerro.webp'

//Gallery
import image1 from '@assets/gallery/image1.jpg'
import image2 from '@assets/gallery/image2.jpg'
import image3 from '@assets/gallery/image3.jpg'
import image4 from '@assets/gallery/image4.jpg'
import image5 from '@assets/gallery/image5.jpg'
import image6 from '@assets/gallery/image6.jpg'

//Video
import photoGraph from '@assets/perfil_video.webp'

export const playerData = {
  name: 'RONALD',
  fullName: 'MARTINEZ',
  number: 77,
  position: 'Delantero',
  positionShort: 'DEL',
  nationality: 'Paraguay',
  nationalityFlag: paraguay,
  age: 30,
  height: '1.78m',
  weight: '75kg',
  foot: 'Derecho',
  birthDate: '25 / 04 / 1996',
  birthPlace: 'Caracas, Venezuela',
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
      season: 'Temporada 2025',
      league: 'Liga Argentina',
      thumbnail: photoGraph,
      cover: photoGraph,
      category: 'Highlights',
    },
  ],

  press: [
    {
      media: 'La Voz del Interior',
      logo:  null,
      title: 'Martínez, el delantero que Talleres necesitaba',
      date:  'Marzo 2025',
      url:   '#',
    },
    {
      media: 'TyC Sports',
      logo:  null,
      title: 'El venezolano que conquistó Córdoba con sus goles',
      date:  'Enero 2025',
      url:   '#',
    },
    {
      media: 'Olé',
      logo:  null,
      title: '"Quiero marcar historia en Talleres" — Ronald Martínez',
      date:  'Noviembre 2024',
      url:   '#',
    },
  ],

  gallery: [
    { id: 1, src: image1, alt: 'Ronald Martínez en acción', caption: 'Liga Profesional 2024', category: 'Partido', aspect: 'wide' },
    { id: 2, src: image2, alt: 'Festejo de gol',            caption: 'Festejo ante Racing',    category: 'Festejo', aspect: 'tall' },
    { id: 3, src: image3, alt: 'Entrenamiento',             caption: 'Pretemporada 2025',       category: 'Entrenamiento', aspect: 'square' },
    { id: 4, src: image4, alt: 'Copa Argentina',            caption: 'Copa Argentina 2024',     category: 'Partido', aspect: 'wide' },
    { id: 5, src: image5, alt: 'Con el plantel',            caption: 'Plantel Talleres 2024',   category: 'Equipo',  aspect: 'wide' },
    { id: 6, src: image6, alt: 'Sesión fotográfica',        caption: 'Foto oficial 2024',       category: 'Retrato', aspect: 'tall' },
  ],

  socialMedia: [
    {
      label:      'Instagram',
      icon:       FaInstagram,
      handle:     '@ronaldmartinez77',
      url:        'https://instagram.com/ronaldmartinez77',
      hoverColor: 'rgba(139,69,19,0.18)',
    },
    {
      label:      'X / Twitter',
      icon:       FaXTwitter,
      handle:     '@ronaldm77',
      url:        'https://x.com/ronaldm77',
      hoverColor: 'rgba(139,69,19,0.18)',
    },
  ],

  contact: [
    {
      title:      'Representante Deportivo',
      label:      'Sport Management SA',
      icon:       IoMdStats,
      handle:     'management@rmartinez77.com',
      url:        'mailto:management@rmartinez77.com',
      hoverColor: 'rgba(139,69,19,0.18)',
    },
    {
      title:      'Contacto Marketing',
      label:      'Prensa & Sponsors',
      icon:       FaEnvelope,
      handle:     'prensa@rmartinez77.com',
      url:        'mailto:prensa@rmartinez77.com',
      hoverColor: 'rgba(212,168,75,0.18)',
    },
  ],

  marqueeItems: [
    'DELANTERO', '·', '#77', '·', 'TALLERES', '·', 'CÓRDOBA', '·',
    'VENEZUELA', '·', '14 GOLES', '·', '7 ASISTENCIAS', '·',
    'RONALD', '·', 'MARTINEZ', '·', 'LIGA PRO 2024', '·',
  ],
}
