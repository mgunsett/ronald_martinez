import { useState, useEffect } from 'react'
import {
  Box, Flex, VStack, HStack, Text, Input, Button,
  FormControl, FormLabel, Grid, GridItem, useToast,
  Divider, Spinner, Badge,
} from '@chakra-ui/react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const emptySlot = {
  home_team: '', away_team: '',
  home_score: '', away_score: '',
  match_date: '', stadium: '', competition: '',
  home_shield: '', away_shield: '',
}

function MatchForm({ slot, label, data, onSave, uploading }) {
  const [form, setForm] = useState({ ...emptySlot, ...data })
  const [shieldFiles, setShieldFiles] = useState({ home: null, away: null })

  useEffect(() => setForm({ ...emptySlot, ...data }), [data])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const labelStyle = {
    fontFamily: 'mono', fontSize: 'xs', color: 'brand.brown',
    textTransform: 'uppercase', letterSpacing: 'widest', mb: 1,
  }

  const inputStyle = {
    bg: 'rgba(139,69,19,0.06)',
    border: '1px solid rgba(139,69,19,0.2)',
    fontFamily: 'mono', fontSize: 'sm', color: 'white',
    _hover: { borderColor: 'rgba(139,69,19,0.45)' },
    _focus: { borderColor: 'brand.brown', boxShadow: '0 0 0 1px #8B4513' },
    _placeholder: { color: 'brand.gray' },
  }

  return (
    <Box
      border="1px solid rgba(139,69,19,0.25)"
      p={6}
      position="relative"
      _before={{ content: '""', position: 'absolute', top: 0, left: 0, w: '28px', h: '2px', bg: 'brand.brown' }}
    >
      <Text fontFamily="mono" fontSize="9px" color="brand.brown"
            textTransform="uppercase" letterSpacing="widest" mb={5}>
        {label}
      </Text>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl>
            <FormLabel {...labelStyle}>Equipo Local</FormLabel>
            <Input {...inputStyle} value={form.home_team} onChange={set('home_team')} placeholder="Ej: Talleres" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel {...labelStyle}>Equipo Visitante</FormLabel>
            <Input {...inputStyle} value={form.away_team} onChange={set('away_team')} placeholder="Ej: River Plate" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel {...labelStyle}>Goles Local</FormLabel>
            <Input {...inputStyle} value={form.home_score} onChange={set('home_score')}
                   placeholder="Vacío = sin resultado" type="number" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel {...labelStyle}>Goles Visitante</FormLabel>
            <Input {...inputStyle} value={form.away_score} onChange={set('away_score')}
                   placeholder="Vacío = sin resultado" type="number" />
          </FormControl>
        </GridItem>
        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel {...labelStyle}>Fecha</FormLabel>
            <Input {...inputStyle} value={form.match_date} onChange={set('match_date')} placeholder="Ej: 22 Jun 2025" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel {...labelStyle}>Estadio</FormLabel>
            <Input {...inputStyle} value={form.stadium} onChange={set('stadium')} placeholder="Ej: Mario Kempes" />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel {...labelStyle}>Competencia</FormLabel>
            <Input {...inputStyle} value={form.competition} onChange={set('competition')} placeholder="Ej: Liga Profesional" />
          </FormControl>
        </GridItem>

        {/* Shield uploads */}
        <GridItem>
          <FormControl>
            <FormLabel {...labelStyle}>Escudo Local (.png)</FormLabel>
            <Input
              {...inputStyle} type="file" accept="image/*" p={1}
              onChange={(e) => setShieldFiles((f) => ({ ...f, home: e.target.files[0] }))}
            />
            {form.home_shield && (
              <Text fontFamily="mono" fontSize="9px" color="brand.gray" mt={1} noOfLines={1}>
                Actual: {form.home_shield}
              </Text>
            )}
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel {...labelStyle}>Escudo Visitante (.png)</FormLabel>
            <Input
              {...inputStyle} type="file" accept="image/*" p={1}
              onChange={(e) => setShieldFiles((f) => ({ ...f, away: e.target.files[0] }))}
            />
            {form.away_shield && (
              <Text fontFamily="mono" fontSize="9px" color="brand.gray" mt={1} noOfLines={1}>
                Actual: {form.away_shield}
              </Text>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Button
        mt={6} w="full"
        bg="brand.brown" color="white"
        fontFamily="mono" fontSize="sm" letterSpacing="widest" textTransform="uppercase"
        _hover={{ bg: 'brand.brownLight' }}
        isLoading={uploading}
        onClick={() => onSave(slot, form, shieldFiles)}
      >
        Guardar
      </Button>
    </Box>
  )
}

export default function AdminPage() {
  const [user,       setUser]       = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [matchData,  setMatchData]  = useState({ last: {}, next: {} })
  const [uploading,  setUploading]  = useState(false)
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [authLoading,setAuthLoading]= useState(false)
  const toast = useToast()

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return }
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    supabase.from('matches').select('*').then(({ data }) => {
      if (!data) return
      const result = {}
      data.forEach((row) => { result[row.slot] = row })
      setMatchData(result)
    })
  }, [user])

  const handleLogin = async () => {
    setAuthLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) toast({ title: error.message, status: 'error', duration: 4000 })
    setAuthLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const uploadShield = async (file, name) => {
    if (!file) return null
    const ext = file.name.split('.').pop()
    const path = `${name.replace(/\s+/g, '_').toLowerCase()}.${ext}`
    const { error } = await supabase.storage.from('shields').upload(path, file, { upsert: true })
    if (error) throw error
    const { data } = supabase.storage.from('shields').getPublicUrl(path)
    return data.publicUrl
  }

  const handleSave = async (slot, form, shieldFiles) => {
    setUploading(true)
    try {
      let homeShieldUrl = form.home_shield || null
      let awayShieldUrl = form.away_shield || null

      if (shieldFiles.home) homeShieldUrl = await uploadShield(shieldFiles.home, form.home_team || 'home')
      if (shieldFiles.away) awayShieldUrl = await uploadShield(shieldFiles.away, form.away_team || 'away')

      const payload = {
        slot,
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

      const { error } = await supabase.from('matches').upsert(payload, { onConflict: 'slot' })
      if (error) throw error

      setMatchData((prev) => ({ ...prev, [slot]: payload }))
      toast({ title: 'Partido guardado', status: 'success', duration: 3000 })
    } catch (err) {
      toast({ title: err.message, status: 'error', duration: 4000 })
    } finally {
      setUploading(false)
    }
  }

  const inputStyle = {
    bg: 'rgba(139,69,19,0.06)', border: '1px solid rgba(139,69,19,0.2)',
    fontFamily: 'mono', fontSize: 'sm', color: 'white',
    _hover: { borderColor: 'rgba(139,69,19,0.45)' },
    _focus: { borderColor: 'brand.brown', boxShadow: '0 0 0 1px #8B4513' },
    _placeholder: { color: 'brand.gray' },
  }

  if (!isSupabaseConfigured) {
    return (
      <Box minH="100vh" bg="brand.dark" display="flex" alignItems="center" justifyContent="center" px={6}>
        <VStack spacing={3} textAlign="center">
          <Text fontFamily="heading" fontSize="2xl" color="white">Supabase no configurado</Text>
          <Text fontFamily="mono" fontSize="sm" color="brand.gray">
            Creá un archivo .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.
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
      <Box minH="100vh" bg="brand.dark" display="flex" alignItems="center" justifyContent="center" px={6}>
        <Box
          w="full" maxW="400px"
          border="1px solid rgba(139,69,19,0.25)" p={8}
          position="relative"
          _before={{ content: '""', position: 'absolute', top: 0, left: 0, w: '28px', h: '2px', bg: 'brand.brown' }}
        >
          <Text fontFamily="heading" fontSize="2xl" color="white" mb={1}>RM_ Admin</Text>
          <Text fontFamily="mono" fontSize="xs" color="brand.gray" letterSpacing="wider" mb={6}>
            Panel de administración
          </Text>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel fontFamily="mono" fontSize="xs" color="brand.brown"
                         textTransform="uppercase" letterSpacing="widest">
                Email
              </FormLabel>
              <Input {...inputStyle} type="email" value={email}
                     onChange={(e) => setEmail(e.target.value)} placeholder="admin@ejemplo.com" />
            </FormControl>
            <FormControl>
              <FormLabel fontFamily="mono" fontSize="xs" color="brand.brown"
                         textTransform="uppercase" letterSpacing="widest">
                Contraseña
              </FormLabel>
              <Input {...inputStyle} type="password" value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
            </FormControl>
            <Button
              w="full" bg="brand.brown" color="white"
              fontFamily="mono" fontSize="sm" letterSpacing="widest" textTransform="uppercase"
              _hover={{ bg: 'brand.brownLight' }} isLoading={authLoading} onClick={handleLogin}
            >
              Ingresar
            </Button>
          </VStack>
        </Box>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg="brand.dark" py={10} px={{ base: 5, lg: 10 }}>
      <Box maxW="1200px" mx="auto">
        {/* Header */}
        <Flex align="center" justify="space-between" mb={10}>
          <Box>
            <Text fontFamily="heading" fontSize="3xl" color="white">RM_ Admin</Text>
            <HStack spacing={2} mt={1}>
              <Badge
                fontFamily="mono" fontSize="9px" bg="rgba(139,69,19,0.2)"
                color="brand.brownLight" border="1px solid rgba(139,69,19,0.3)"
                px={2} py={0.5} letterSpacing="widest"
              >
                Panel de Partidos
              </Badge>
              <Text fontFamily="mono" fontSize="10px" color="brand.gray">{user.email}</Text>
            </HStack>
          </Box>
          <Button
            variant="outline" borderColor="rgba(139,69,19,0.4)"
            color="brand.gray" fontFamily="mono" fontSize="xs"
            letterSpacing="widest" textTransform="uppercase"
            _hover={{ borderColor: 'brand.brown', color: 'white' }}
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </Flex>

        <Divider borderColor="rgba(139,69,19,0.15)" mb={8} />

        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
          <MatchForm
            slot="last"
            label="Último Resultado"
            data={matchData.last}
            onSave={handleSave}
            uploading={uploading}
          />
          <MatchForm
            slot="next"
            label="Próximo Partido"
            data={matchData.next}
            onSave={handleSave}
            uploading={uploading}
          />
        </Grid>

        <Box mt={8} p={4} border="1px solid rgba(139,69,19,0.12)">
          <Text fontFamily="mono" fontSize="9px" color="brand.gray"
                letterSpacing="widest" textTransform="uppercase">
            Los cambios se reflejan en tiempo real en el Hero. Bucket de Supabase:{' '}
            <Box as="span" color="brand.brownLight">shields</Box>
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
