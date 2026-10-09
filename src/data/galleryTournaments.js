// Fotos optimizadas en assets/gallery/<galería>/:
//   <nombre>.webp        → lightbox (lado mayor 2000px)
//   <nombre>.thumb.webp  → tarjetas del recorrido (lado menor 720px)
// Los originales en alta quedan en assets/galleryTorneos (no se empaquetan).
const files = import.meta.glob('../../assets/gallery/*/*.webp', { eager: true, import: 'default' })
const asset = (folder, name) => files[`../../assets/gallery/${folder}/${name}.webp`]

const photo = (n, folder, name, caption) => ({
  id: `img${n}`,
  src: asset(folder, name),
  thumb: asset(folder, `${name}.thumb`),
  caption,
  alt: `Ronaldo Martínez: ${caption.charAt(0).toLowerCase()}${caption.slice(1)}`,
})

const series = (from, folder, prefix, count, caption) =>
  Array.from({ length: count }, (_, i) => photo(from + i, folder, `${prefix}${i + 1}`, caption))

export const DEFAULT_TOURNAMENT_ID = 'partidos'

export const tournaments = [
  {
    id: 'partidos',
    name: 'Velez',
    order: 1,
    photos: series(1, 'velez', 'velez', 9, 'Ronaldo Martínez en el partido ante Velez Sarsfield'),
  },
  {
    id: 'festejos',
    name: 'Selección',
    order: 2,
    photos: series(1, 'seleccion', 'paraguay', 7, 'Ronaldo Martínez en la selección paraguaya'),
  },
  {
    id: 'previa',
    name: 'Equipos',
    order: 3,
    photos: [
      ...series(1, 'equipos', 'talleres', 10, 'Ronaldo Martínez en Talleres'),
      ...series(11, 'equipos', 'platense', 10, 'Ronaldo Martínez en Platense'),
    ],
  },
]

export default tournaments
