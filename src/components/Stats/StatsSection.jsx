import { Box } from '@chakra-ui/react'
import StatsDossier from './StatsDossier'
import ClubsGrid from '../Clubs/ClubsGrid'

export default function StatsSection() {
  return (
    <Box
      as="section"
      id="estadisticas"
      bg="#050B14"
      pt={{ base: 16, lg: 20 }}
      pb={{ base: 16, lg: 20 }}
      px={{ base: 5, lg: 10 }}
      borderTopLeftRadius={{ base: '14px', lg: '22px' }}
      borderTopRightRadius={{ base: '14px', lg: '22px' }}
      boxShadow="0 -24px 80px rgba(0,0,0,0.65)"
    >
      <Box maxW="1400px" mx="auto">
        <StatsDossier />

        <ClubsGrid />
      </Box>
    </Box>
  )
}
