import { useState, useEffect, useRef } from 'react'
import {
  Box, Flex, VStack, HStack, Text, Input, Button, Image,
  FormControl, FormLabel, Grid, GridItem, useToast,
  Divider, Spinner, Badge, IconButton, Tabs, TabList,
  TabPanels, TabPanel, Tab,
} from '@chakra-ui/react'
import { FiEdit2, FiTrash2, FiUpload, FiLogOut, FiSave } from 'react-icons/fi'
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, auth, storage, isFirebaseConfigured } from '../lib/firebase'

const emptySlot = {
  home_team: '', away_team: '',
  home_score: '', away_score: '',
  match_date: '', stadium: '', competition: '',
  home_shield: '', away_shield: '',
}

const labelStyle = {
  fontFamily: 'mono', fontSize: '10px', color: 'brand.gray',
  textTransform: 'uppercase', letterSpacing: 'widest', mb: 1,
}

const inputStyle = {
  bg: 'brand.dark',
  border: '1px solid',
  borderColor: 'brand.brownDark',
  borderRadius: 'md',
  fontFamily: 'mono', fontSize: 'sm', color: 'white',
  h: '42px',
  _hover: { borderColor: 'brand.gray' },
  _focus: { borderColor: 'brand.brown', boxShadow: '0 0 0 1px rgba(30,95,168,0.4)' },
  _placeholder: { color: 'rgba(122,140,163,0.5)' },
}

function ShieldUpload({ label, currentUrl, onFileChange }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    onFileChange(file)
    setPreview(URL.createObjectURL(file))
  }

  const displayUrl = preview || currentUrl

  return (
    <FormControl>
      <FormLabel {...labelStyle}>{label}</FormLabel>
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        display="none"
        onChange={handleChange}
      />
      <Flex
        align="center"
        gap={3}
        p={2}
        border="1px dashed"
        borderColor="brand.brownDark"
        borderRadius="md"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{ borderColor: 'brand.brown', bg: 'rgba(30,95,168,0.04)' }}
        onClick={() => inputRef.current?.click()}
        minH="56px"
      >
        {displayUrl ? (
          <Image src={displayUrl} boxSize="40px" objectFit="contain" borderRadius="sm" />
        ) : (
          <Flex
            boxSize="40px"
            align="center"
            justify="center"
            bg="brand.brownDark"
            borderRadius="sm"
          >
            <FiUpload color="#4D93D6" size={16} />
          </Flex>
        )}
        <Text fontFamily="mono" fontSize="11px" color="brand.gray">
          {displayUrl ? 'Cambiar imagen' : 'Subir escudo'}
        </Text>
      </Flex>
    </FormControl>
  )
}

function MatchForm({ slot, label, data, onSave, uploading }) {
  const [form, setForm] = useState({ ...emptySlot, ...data })
  const [shieldFiles, setShieldFiles] = useState({ home: null, away: null })

  useEffect(() => setForm({ ...emptySlot, ...data }), [data])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <Box>
      <Text fontFamily="mono" fontSize="10px" color="brand.brown"
            textTransform="uppercase" letterSpacing="widest" mb={4}>
        {label}
      </Text>

      <Grid templateColumns={{ base: '1fr', md: '1fr auto 1fr' }} gap={{ base: 4, md: 3 }} alignItems="start">
        {/* Local */}
        <VStack spacing={3} align="stretch">
          <Box px={3} py={2} bg="rgba(30,95,168,0.05)" borderRadius="md" border="1px solid" borderColor="brand.brownDark">
            <Text fontFamily="mono" fontSize="9px" color="brand.brownLight"
                  textTransform="uppercase" letterSpacing="widest" mb={2}>
              Local
            </Text>
            <FormControl mb={3}>
              <FormLabel {...labelStyle}>Equipo</FormLabel>
              <Input {...inputStyle} value={form.home_team} onChange={set('home_team')} placeholder="Ej: Talleres" />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel {...labelStyle}>Goles</FormLabel>
              <Input {...inputStyle} value={form.home_score} onChange={set('home_score')}
                     placeholder="—" type="number" textAlign="center" />
            </FormControl>
            <ShieldUpload
              label="Escudo"
              currentUrl={form.home_shield}
              onFileChange={(f) => setShieldFiles((s) => ({ ...s, home: f }))}
            />
          </Box>
        </VStack>

        {/* VS divider */}
        <Flex align="center" justify="center" h="100%" display={{ base: 'none', md: 'flex' }} pt={10}>
          <Text fontFamily="heading" fontSize="2xl" color="brand.brownDark">VS</Text>
        </Flex>

        {/* Visitante */}
        <VStack spacing={3} align="stretch">
          <Box px={3} py={2} bg="rgba(30,95,168,0.05)" borderRadius="md" border="1px solid" borderColor="brand.brownDark">
            <Text fontFamily="mono" fontSize="9px" color="brand.brownLight"
                  textTransform="uppercase" letterSpacing="widest" mb={2}>
              Visitante
            </Text>
            <FormControl mb={3}>
              <FormLabel {...labelStyle}>Equipo</FormLabel>
              <Input {...inputStyle} value={form.away_team} onChange={set('away_team')} placeholder="Ej: River Plate" />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel {...labelStyle}>Goles</FormLabel>
              <Input {...inputStyle} value={form.away_score} onChange={set('away_score')}
                     placeholder="—" type="number" textAlign="center" />
            </FormControl>
            <ShieldUpload
              label="Escudo"
              currentUrl={form.away_shield}
              onFileChange={(f) => setShieldFiles((s) => ({ ...s, away: f }))}
            />
          </Box>
        </VStack>
      </Grid>

      {/* Match details */}
      <Grid templateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }} gap={3} mt={4}>
        <FormControl>
          <FormLabel {...labelStyle}>Fecha</FormLabel>
          <Input {...inputStyle} value={form.match_date} onChange={set('match_date')} placeholder="22 Jun 2025" />
        </FormControl>
        <FormControl>
          <FormLabel {...labelStyle}>Estadio</FormLabel>
          <Input {...inputStyle} value={form.stadium} onChange={set('stadium')} placeholder="Mario Kempes" />
        </FormControl>
        <FormControl>
          <FormLabel {...labelStyle}>Competencia</FormLabel>
          <Input {...inputStyle} value={form.competition} onChange={set('competition')} placeholder="Liga Profesional" />
        </FormControl>
      </Grid>

      <Button
        mt={5} w="full"
        bg="brand.brown" color="white"
        fontFamily="mono" fontSize="sm" letterSpacing="widest" textTransform="uppercase"
        borderRadius="md" h="44px"
        leftIcon={<FiSave />}
        _hover={{ bg: 'brand.brownLight' }}
        _active={{ bg: 'brand.brownDark' }}
        isLoading={uploading}
        onClick={() => onSave(slot, form, shieldFiles)}
      >
        Guardar {slot === 'last' ? 'Resultado' : 'Partido'}
      </Button>
    </Box>
  )
}

function MatchPreviewCard({ slot, data, label, onEdit, onDelete }) {
  const hasData = data && data.home_team

  if (!hasData) {
    return (
      <Box
        border="1px dashed"
        borderColor="brand.brownDark"
        borderRadius="lg"
        p={{ base: 4, md: 6 }}
        textAlign="center"
      >
        <Text fontFamily="mono" fontSize="10px" color="brand.gray"
              textTransform="uppercase" letterSpacing="widest" mb={2}>
          {label}
        </Text>
        <Text fontFamily="mono" fontSize="sm" color="brand.brownDark">
          Sin datos cargados
        </Text>
      </Box>
    )
  }

  const homeScore = data.home_score ?? '—'
  const awayScore = data.away_score ?? '—'

  return (
    <Box
      border="1px solid"
      borderColor="brand.brownDark"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ borderColor: 'brand.brown' }}
    >
      {/* Card header */}
      <Flex
        justify="space-between"
        align="center"
        px={4} py={2}
        bg="rgba(30,95,168,0.08)"
        borderBottom="1px solid"
        borderColor="brand.brownDark"
      >
        <Badge
          fontFamily="mono" fontSize="9px"
          bg={slot === 'last' ? 'brand.amberLight' : 'brand.brownLight'}
          color={slot === 'last' ? 'brand.amber' : 'brand.brownLight'}
          border="1px solid"
          borderColor={slot === 'last' ? 'brand.amber' : 'brand.brownLight'}
          px={2} py={0.5} letterSpacing="widest" textTransform="uppercase"
        >
          {label}
        </Badge>
        <HStack spacing={1}>
          <IconButton
            icon={<FiEdit2 size={14} />}
            size="sm" variant="ghost"
            color="brand.gray"
            _hover={{ color: 'brand.brownLight', bg: 'rgba(30,95,168,0.1)' }}
            aria-label="Editar"
            onClick={onEdit}
          />
          <IconButton
            icon={<FiTrash2 size={14} />}
            size="sm" variant="ghost"
            color="brand.gray"
            _hover={{ color: 'red.400', bg: 'rgba(255,0,0,0.06)' }}
            aria-label="Eliminar"
            onClick={onDelete}
          />
        </HStack>
      </Flex>

      {/* Match display */}
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        align="center"
        justify="center"
        gap={{ base: 3, sm: 6 }}
        px={4} py={{ base: 4, md: 5 }}
      >
        {/* Home team */}
        <VStack spacing={2} flex={1} minW={0}>
          {data.home_shield ? (
            <Image src={data.home_shield} boxSize={{ base: '44px', md: '52px' }} objectFit="contain" />
          ) : (
            <Flex boxSize={{ base: '44px', md: '52px' }} align="center" justify="center"
                  bg="brand.brownDark" borderRadius="md">
              <Text fontFamily="heading" fontSize="sm" color="brand.brownLight">
                {data.home_team?.slice(0, 3).toUpperCase()}
              </Text>
            </Flex>
          )}
          <Text fontFamily="mono" fontSize={{ base: '11px', md: '12px' }} color="white"
                textTransform="uppercase" letterSpacing="wider" textAlign="center" noOfLines={1}>
            {data.home_team}
          </Text>
        </VStack>

        {/* Score */}
        <HStack spacing={3} flexShrink={0}>
          <Text fontFamily="heading" fontSize={{ base: '3xl', md: '4xl' }} color="white" lineHeight={1}>
            {homeScore}
          </Text>
          <Text fontFamily="heading" fontSize={{ base: 'lg', md: 'xl' }} color="brand.brownDark" lineHeight={1}>
            —
          </Text>
          <Text fontFamily="heading" fontSize={{ base: '3xl', md: '4xl' }} color="white" lineHeight={1}>
            {awayScore}
          </Text>
        </HStack>

        {/* Away team */}
        <VStack spacing={2} flex={1} minW={0}>
          {data.away_shield ? (
            <Image src={data.away_shield} boxSize={{ base: '44px', md: '52px' }} objectFit="contain" />
          ) : (
            <Flex boxSize={{ base: '44px', md: '52px' }} align="center" justify="center"
                  bg="brand.brownDark" borderRadius="md">
              <Text fontFamily="heading" fontSize="sm" color="brand.brownLight">
                {data.away_team?.slice(0, 3).toUpperCase()}
              </Text>
            </Flex>
          )}
          <Text fontFamily="mono" fontSize={{ base: '11px', md: '12px' }} color="white"
                textTransform="uppercase" letterSpacing="wider" textAlign="center" noOfLines={1}>
            {data.away_team}
          </Text>
        </VStack>
      </Flex>

      {/* Match meta */}
      <Flex
        px={4} py={2}
        bg="rgba(30,95,168,0.04)"
        borderTop="1px solid"
        borderColor="brand.brownDark"
        justify="space-between"
        align="center"
        wrap="wrap"
        gap={2}
      >
        <HStack spacing={3}>
          {data.match_date && (
            <Text fontFamily="mono" fontSize="10px" color="brand.gray" letterSpacing="wider">
              {data.match_date}
            </Text>
          )}
          {data.competition && (
            <Badge fontFamily="mono" fontSize="8px" bg="rgba(30,95,168,0.1)"
                   color="brand.brownLight" px={2} py={0.5} letterSpacing="wider">
              {data.competition}
            </Badge>
          )}
        </HStack>
        {data.stadium && (
          <Text fontFamily="mono" fontSize="10px" color="brand.gray" letterSpacing="wider"
                noOfLines={1} maxW={{ base: '120px', md: '200px' }}>
            {data.stadium}
          </Text>
        )}
      </Flex>
    </Box>
  )
}

export default function AdminPage() {
  const [user,        setUser]        = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [matchData,   setMatchData]   = useState({ last: {}, next: {} })
  const [uploading,   setUploading]   = useState(false)
  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [tabIndex,    setTabIndex]    = useState(0)
  const toast = useToast()

  useEffect(() => {
    if (!isFirebaseConfigured) { setLoading(false); return }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    const loadMatches = async () => {
      const [lastSnap, nextSnap] = await Promise.all([
        getDoc(doc(db, 'matches', 'last')),
        getDoc(doc(db, 'matches', 'next')),
      ])
      const result = {}
      if (lastSnap.exists()) result.last = lastSnap.data()
      if (nextSnap.exists()) result.next = nextSnap.data()
      setMatchData(result)
    }
    loadMatches()
  }, [user])

  const handleLogin = async () => {
    setAuthLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      toast({ title: err.message, status: 'error', duration: 4000 })
    }
    setAuthLoading(false)
  }

  const handleLogout = async () => {
    await signOut(auth)
    setUser(null)
  }

  const uploadShield = async (file, name) => {
    if (!file) return null
    const ext = file.name.split('.').pop()
    const path = `shields/${name.replace(/\s+/g, '_').toLowerCase()}.${ext}`
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
  }

  const handleSave = async (slot, form, shieldFiles) => {
    setUploading(true)
    try {
      let homeShieldUrl = form.home_shield || null
      let awayShieldUrl = form.away_shield || null

      if (shieldFiles.home) homeShieldUrl = await uploadShield(shieldFiles.home, form.home_team || 'home')
      if (shieldFiles.away) awayShieldUrl = await uploadShield(shieldFiles.away, form.away_team || 'away')

      const payload = {
        home_team:   form.home_team,
        away_team:   form.away_team,
        home_score:  form.home_score !== '' ? Number(form.home_score) : null,
        away_score:  form.away_score !== '' ? Number(form.away_score) : null,
        match_date:  form.match_date,
        stadium:     form.stadium,
        competition: form.competition,
        home_shield: homeShieldUrl,
        away_shield: awayShieldUrl,
        updated_at:  new Date().toISOString(),
      }

      await setDoc(doc(db, 'matches', slot), payload)
      setMatchData((prev) => ({ ...prev, [slot]: payload }))
      toast({ title: 'Partido guardado', status: 'success', duration: 3000 })
    } catch (err) {
      toast({ title: err.message, status: 'error', duration: 4000 })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (slot) => {
    try {
      await deleteDoc(doc(db, 'matches', slot))
      setMatchData((prev) => ({ ...prev, [slot]: {} }))
      toast({ title: 'Partido eliminado', status: 'info', duration: 3000 })
    } catch (err) {
      toast({ title: err.message, status: 'error', duration: 4000 })
    }
  }

  const handleEdit = (slot) => {
    setTabIndex(slot === 'last' ? 0 : 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isFirebaseConfigured) {
    return (
      <Box minH="100vh" bg="brand.dark" display="flex" alignItems="center" justifyContent="center" px={6}>
        <VStack spacing={3} textAlign="center">
          <Text fontFamily="heading" fontSize="2xl" color="white">Firebase no configurado</Text>
          <Text fontFamily="mono" fontSize="sm" color="brand.gray">
            Creá un archivo .env con las variables VITE_FIREBASE_ correspondientes.
          </Text>
        </VStack>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box minH="100vh" bg="brand.dark" display="flex" alignItems="center" justifyContent="center">
        <Spinner color="brand.brown" size="lg" />
      </Box>
    )
  }

  if (!user) {
    return (
      <Box minH="100vh" bg="brand.dark" display="flex" alignItems="center" justifyContent="center" px={4}>
        <Box
          w="full" maxW="380px"
          bg="rgba(11,42,74,0.4)"
          border="1px solid"
          borderColor="brand.brownDark"
          borderRadius="xl"
          p={{ base: 6, md: 8 }}
          backdropFilter="blur(10px)"
        >
          <VStack spacing={1} mb={6}>
            <Text fontFamily="heading" fontSize="3xl" color="white">RONALDO <Text as="span" color="brand.brown">MARTINEZ</Text> _</Text>
            <Text fontFamily="mono" fontSize="10px" color="brand.gray"
                  letterSpacing="widest" textTransform="uppercase">
              Panel de administración
            </Text>
          </VStack>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel {...labelStyle}>Email</FormLabel>
              <Input {...inputStyle} type="email" value={email}
                     onChange={(e) => setEmail(e.target.value)} placeholder="admin@ejemplo.com" />
            </FormControl>
            <FormControl>
              <FormLabel {...labelStyle}>Contraseña</FormLabel>
              <Input {...inputStyle} type="password" value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
            </FormControl>
            <Button
              w="full" bg="brand.brown" color="white" h="44px"
              fontFamily="mono" fontSize="sm" letterSpacing="widest" textTransform="uppercase"
              borderRadius="md"
              _hover={{ bg: 'brand.brownLight' }}
              _active={{ bg: 'brand.brownDark' }}
              isLoading={authLoading}
              onClick={handleLogin}
            >
              Ingresar
            </Button>
          </VStack>
        </Box>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg="brand.dark" py={{ base: 6, md: 10 }} px={{ base: 4, md: 6, lg: 10 }}>
      <Box maxW="900px" mx="auto">
        {/* Header */}
        <Flex align="center" justify="space-between" mb={{ base: 6, md: 8 }}>
          <Box>
            <Text fontFamily="heading" fontSize={{ base: '2xl', md: '3xl' }} color="white" lineHeight={1}>
              RM_ Admin
            </Text>
            <HStack spacing={2} mt={2}>
              <Badge
                fontFamily="mono" fontSize="9px" bg="rgba(30,95,168,0.15)"
                color="brand.brownLight" border="1px solid rgba(30,95,168,0.3)"
                px={2} py={0.5} letterSpacing="widest"
              >
                Partidos
              </Badge>
              <Text fontFamily="mono" fontSize="10px" color="brand.gray"
                    display={{ base: 'none', sm: 'block' }}>
                {user.email}
              </Text>
            </HStack>
          </Box>
          <Button
            variant="ghost"
            color="brand.gray"
            fontFamily="mono" fontSize="xs"
            letterSpacing="widest" textTransform="uppercase"
            leftIcon={<FiLogOut />}
            _hover={{ color: 'white', bg: 'rgba(30,95,168,0.1)' }}
            onClick={handleLogout}
          >
            <Text display={{ base: 'none', sm: 'block' }}>Salir</Text>
          </Button>
        </Flex>

        <Divider borderColor="brand.brownDark" mb={{ base: 5, md: 8 }} />

        {/* Forms with tabs */}
        <Box
          bg="rgba(11,42,74,0.25)"
          border="1px solid"
          borderColor="brand.brownDark"
          borderRadius="xl"
          p={{ base: 4, md: 6 }}
          mb={{ base: 6, md: 8 }}
        >
          <Tabs
            index={tabIndex}
            onChange={setTabIndex}
            variant="unstyled"
          >
            <TabList mb={5} gap={2}>
              <Tab
                fontFamily="mono" fontSize="11px" letterSpacing="widest"
                textTransform="uppercase" color="brand.gray"
                borderRadius="md" px={4} py={2}
                _selected={{ color: 'white', bg: 'brand.brown' }}
                _hover={{ color: 'white' }}
              >
                Último Resultado
              </Tab>
              <Tab
                fontFamily="mono" fontSize="11px" letterSpacing="widest"
                textTransform="uppercase" color="brand.gray"
                borderRadius="md" px={4} py={2}
                _selected={{ color: 'white', bg: 'brand.brown' }}
                _hover={{ color: 'white' }}
              >
                Próximo Partido
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0}>
                <MatchForm
                  slot="last"
                  label="Cargar último resultado"
                  data={matchData.last}
                  onSave={handleSave}
                  uploading={uploading}
                />
              </TabPanel>
              <TabPanel p={0}>
                <MatchForm
                  slot="next"
                  label="Cargar próximo partido"
                  data={matchData.next}
                  onSave={handleSave}
                  uploading={uploading}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* Preview section */}
        <Box mb={6}>
          <Text fontFamily="mono" fontSize="10px" color="brand.gray"
                textTransform="uppercase" letterSpacing="widest" mb={4}>
            Datos cargados
          </Text>

          <VStack spacing={4} align="stretch">
            <MatchPreviewCard
              slot="last"
              data={matchData.last}
              label="Último Resultado"
              onEdit={() => handleEdit('last')}
              onDelete={() => handleDelete('last')}
            />
            <MatchPreviewCard
              slot="next"
              data={matchData.next}
              label="Próximo Partido"
              onEdit={() => handleEdit('next')}
              onDelete={() => handleDelete('next')}
            />
          </VStack>
        </Box>
      </Box>
    </Box>
  )
}
