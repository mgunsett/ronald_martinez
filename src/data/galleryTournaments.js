// ─────────────────────────────────────────────────────────────────
// Galería segmentada en 3 secciones (datos estáticos / fallback).
// Archivo NUEVO: no reemplaza ni modifica playerData.gallery.
//
// ⚠️ PROVISORIO: secciones y reparto según lo que se ve en cada foto.
// Cada sección toma sus fotos de su subcarpeta en assets/galleryTorneos:
//   Partidos/  ·  Festejos/  ·  Previa/
// Son copias optimizadas (máx. 1800 px) de assets/gallery; los
// originales quedan intactos.
//
// Para sumar una foto: copiala a la subcarpeta, importala abajo y
// agregala al array `photos` de la sección. La primera foto es la
// portada (la que se ve en la vista previa y arranca en el carrusel).
// ─────────────────────────────────────────────────────────────────

// Partidos
import image3 from '@assets/galleryTorneos/Partidos/image3.webp'
import image8 from '@assets/galleryTorneos/Partidos/image8.webp'
import image4 from '@assets/galleryTorneos/Partidos/image4.webp'
import image7 from '@assets/galleryTorneos/Partidos/image7.webp'
import image10 from '@assets/galleryTorneos/Partidos/image10.webp'

// Festejos
import image1 from '@assets/galleryTorneos/Festejos/image1.webp'
import image2 from '@assets/galleryTorneos/Festejos/image2.webp'
import image6 from '@assets/galleryTorneos/Festejos/image6.webp'

// Previa
import image5 from '@assets/galleryTorneos/Previa/image5.webp'
import image9 from '@assets/galleryTorneos/Previa/image9.webp'

const photo = (n, src, caption) => ({
  id: `img${n}`,
  src,
  caption,
  alt: `Ronaldo Martínez: ${caption.charAt(0).toLowerCase()}${caption.slice(1)}`,
})

export const DEFAULT_TOURNAMENT_ID = 'partidos'

export const tournaments = [
  {
    id: 'partidos',
    name: 'Partidos',
    order: 1,
    photos: [
      photo(3, image3, 'Definición en el área'),
      photo(8, image8, 'Remate con la camiseta alternativa'),
      photo(4, image4, 'Encarando a la defensa'),
      photo(7, image7, 'Pegándole de volea'),
      photo(10, image10, 'Corriendo por la banda'),
    ],
  },
  {
    id: 'festejos',
    name: 'Festejos',
    order: 2,
    photos: [
      photo(1, image1, 'Festejo con sus compañeros'),
      photo(2, image2, 'Grito de gol ante la tribuna'),
      photo(6, image6, 'Salida al campo de juego'),
    ],
  },
  {
    id: 'previa',
    name: 'Previa',
    order: 3,
    photos: [
      photo(5, image5, 'Llegada al estadio'),
      photo(9, image9, 'El 77 en la espalda'),
    ],
  },
]

export default tournaments
