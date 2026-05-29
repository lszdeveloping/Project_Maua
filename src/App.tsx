import {
  Bike,
  ChevronRight,
  CloudSun,
  Compass,
  Droplets,
  Landmark,
  MapPin,
  MapPinned,
  Navigation,
  Star,
  SunMedium,
  Waves,
  Wind,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PontoCard } from './components/PontoCard'
import { PontoDetalhesModal } from './components/PontoDetalhesModal'
import { FiltroPontos } from './components/FiltroPontos'
import {
  filtrarPontos,
  pontosSantos,
  type FiltroPonto,
  type PontoSantos,
} from './data/pontosSantos'

type Beach = {
  id: string
  name: string
  city: string
  lat: number
  lon: number
  score: number
  crowd: string
  sea: string
  highlight: string
  image?: string
  imageCredit?: string
  sourceLabel: string
  sourceUrl?: string
  communitySourceLabel?: string
  communitySourceUrl?: string
  communityScore?: number
  communityReviews?: number
}

type Route = {
  id: string
  name: string
  region: string
  distanceKm: number
  calories: number
  time: string
  difficulty: string
  highlight: string
  destinationLat: number
  destinationLon: number
}

type Attraction = {
  id: string
  name: string
  city: string
  category: string
  distance: string
  description: string
  address: string
  source: string
  lat: number
  lon: number
  website?: string
  image?: string
  imageCredit?: string
}

type TotemScreen = 'inicio' | 'praias' | 'clima' | 'turismo' | 'pontos' | 'bike'

type WeatherState = {
  temp: number
  description: string
  humidity: number
  windSpeed: number
  feelsLike: number
  city: string
}

const weatherFallback: WeatherState = {
  temp: 22,
  description: 'Chuva fraca com céu parcialmente nublado.',
  humidity: 73,
  windSpeed: 10,
  feelsLike: 22,
  city: 'Santos',
}

const beaches: Beach[] = [
  {
    id: 'jose-menino',
    name: 'Praia do José Menino',
    city: 'Santos',
    lat: -23.9658,
    lon: -46.3342,
    score: 4.7,
    crowd: 'Movimento alto',
    sea: 'Boa para surf e mar variado',
    highlight:
      'Conhecida pelo Emissário Submarino, Orquidário e pelo Quebra-Mar, ponto clássico de surfistas.',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Praia%20do%20Jos%C3%A9%20Menino%20%282763029122%29.jpg',
    imageCredit: 'Wikimedia Commons',
    sourceLabel: 'Wikimedia Commons e curadoria baseada no texto fornecido',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Praia_do_Jos%C3%A9_Menino_(2763029122).jpg',
    communitySourceLabel: 'Tripadvisor',
    communitySourceUrl:
      'https://www.tripadvisor.com.br/Attraction_Review-g303625-d2361803-Reviews-Praia_do_Jose_Menino-Santos_State_of_Sao_Paulo.html',
    communityScore: 3.9,
    communityReviews: 207,
  },
  {
    id: 'pompeia',
    name: 'Praia da Pompéia',
    city: 'Santos',
    lat: -23.9705,
    lon: -46.3388,
    score: 4.6,
    crowd: 'Movimento médio',
    sea: 'Mar calmo',
    highlight:
      'Trecho mais tranquilo e residencial da orla, com destaque para o monumento de Tomie Ohtake.',
    image:
      'https://www.santos.sp.gov.br/static/files_www/styles/portal-quadrado/public/imagens/bairros/hero-pompeia.jpg',
    imageCredit: 'Portal Prefeitura de Santos',
    sourceLabel: 'Portal Prefeitura de Santos e curadoria baseada no texto fornecido',
    sourceUrl: 'https://www.santos.sp.gov.br/?q=portal%2Fpompeia',
  },
  {
    id: 'gonzaga',
    name: 'Praia do Gonzaga',
    city: 'Santos',
    lat: -23.9734,
    lon: -46.3336,
    score: 4.8,
    crowd: 'Movimento alto',
    sea: 'Mar calmo',
    highlight:
      'A mais badalada e central, perto de shoppings, restaurantes e hotéis, com ótima faixa de areia.',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Santos%2C%20SP%20-%20Praia%20do%20Gonzaga.jpg',
    imageCredit: 'Wikimedia Commons',
    sourceLabel: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Santos,_SP_-_Praia_do_Gonzaga.jpg',
  },
  {
    id: 'boqueirao',
    name: 'Praia do Boqueirão',
    city: 'Santos',
    lat: -23.9781,
    lon: -46.3279,
    score: 4.7,
    crowd: 'Movimento médio',
    sea: 'Mar calmo',
    highlight:
      'Praia tradicional e muito frequentada, no coração da orla e próxima a praças e comércio.',
    image: 'https://www.santos.sp.gov.br/static/files_www/imagens/bairros/hero-boqueirao.jpg',
    imageCredit: 'Portal Prefeitura de Santos',
    sourceLabel: 'Portal Prefeitura de Santos e curadoria baseada no texto fornecido',
    sourceUrl: 'https://www.santos.sp.gov.br/?q=portal%2Fboqueirao',
  },
  {
    id: 'embare',
    name: 'Praia do Embaré',
    city: 'Santos',
    lat: -23.9822,
    lon: -46.3198,
    score: 4.6,
    crowd: 'Movimento médio',
    sea: 'Mar calmo',
    highlight:
      'Famosa pela Basílica do Embaré e por atrair público jovem entre os canais 4 e 5.',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Praia%20do%20Embar%C3%A9%20-%20Santos%20%282762167755%29.jpg',
    imageCredit: 'Wikimedia Commons',
    sourceLabel: 'Wikimedia Commons e curadoria baseada no texto fornecido',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Praia_do_Embar%C3%A9_-_Santos_(2762167755).jpg',
  },
  {
    id: 'aparecida',
    name: 'Praia de Aparecida',
    city: 'Santos',
    lat: -23.9854,
    lon: -46.3094,
    score: 4.5,
    crowd: 'Movimento familiar',
    sea: 'Mar calmo',
    highlight:
      'Conhecida pela estrutura do SESC, pela Fonte do Sapo e por ser uma área mais residencial e familiar.',
    image: 'https://www.santos.sp.gov.br/static/files_www/imagens/bairros/hero-aparecida.jpg',
    imageCredit: 'Portal Prefeitura de Santos',
    sourceLabel: 'Portal Prefeitura de Santos e curadoria baseada no texto fornecido',
    sourceUrl: 'https://www.santos.sp.gov.br/?q=portal%2Faparecida',
  },
  {
    id: 'ponta-da-praia',
    name: 'Ponta da Praia',
    city: 'Santos',
    lat: -23.9893,
    lon: -46.3008,
    score: 4.7,
    crowd: 'Movimento alto',
    sea: 'Faixa de areia mais estreita',
    highlight:
      'Trecho final da orla, próximo ao Aquário e às balsas, ótimo para ver o pôr do sol e os cruzeiros.',
    image: 'https://www.santos.sp.gov.br/static/files_www/imagens/bairros/hero-pontadapraia.jpg',
    imageCredit: 'Portal Prefeitura de Santos',
    sourceLabel: 'Portal Prefeitura de Santos e curadoria baseada no texto fornecido',
    sourceUrl: 'https://www.santos.sp.gov.br/?q=portal%2Fponta-da-praia',
  },
  {
    id: 'enseada-guaruja',
    name: 'Praia da Enseada',
    city: 'Guarujá',
    lat: -23.9898,
    lon: -46.2145,
    score: 4.8,
    crowd: 'Movimento alto',
    sea: 'Boa para banho e esportes',
    highlight:
      'A maior do Guarujá, ideal para esportes, caminhadas e com vasta infraestrutura de quiosques e hotéis.',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Panorama%20Praia%20da%20Enseada%2C%20Guaruj%C3%A1%2C%20S%C3%A3o%20Paulo%20-%20panoramio.jpg',
    imageCredit: 'Wikimedia Commons',
    sourceLabel: 'Wikimedia Commons e curadoria baseada no texto fornecido',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Panorama_Praia_da_Enseada,_Guaruj%C3%A1,_S%C3%A3o_Paulo_-_panoramio.jpg',
  },
  {
    id: 'pitangueiras',
    name: 'Praia das Pitangueiras',
    city: 'Guarujá',
    lat: -24.0059,
    lon: -46.2561,
    score: 4.7,
    crowd: 'Movimento alto',
    sea: 'Mar urbano e acessível',
    highlight:
      'Praia central e muito movimentada, com calçadão, comércio e acesso fácil.',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Praia%20das%20Pitangueiras.jpg',
    imageCredit: 'Wikimedia Commons',
    sourceLabel: 'Wikimedia Commons e Portal Guarujá de Turismo',
    sourceUrl: 'https://portalguaruja.tur.br/atracoes/praia-das-pitangueiras/',
  },
  {
    id: 'asturias',
    name: 'Praia das Astúrias',
    city: 'Guarujá',
    lat: -24.0134,
    lon: -46.2497,
    score: 4.7,
    crowd: 'Movimento familiar',
    sea: 'Águas mais calmas',
    highlight:
      'Muito frequentada por famílias, conhecida também pela tradicional feira de pescados.',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Praia%20das%20Ast%C3%BArias.jpg',
    imageCredit: 'Wikimedia Commons',
    sourceLabel: 'Wikimedia Commons e Portal Guarujá de Turismo',
    sourceUrl: 'https://portalguaruja.tur.br/atracoes/praias-das-asturias/',
  },
  {
    id: 'tombo',
    name: 'Praia do Tombo',
    city: 'Guarujá',
    lat: -24.0172,
    lon: -46.2418,
    score: 4.8,
    crowd: 'Movimento esportivo',
    sea: 'Boa para surfe',
    highlight:
      'Preferida dos surfistas, com ondas fortes, Bandeira Azul e boa estrutura de quiosques, bares e restaurantes.',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Praia%20do%20tombo1.jpg',
    imageCredit: 'Wikimedia Commons',
    sourceLabel: 'Wikimedia Commons e Portal Guarujá de Turismo',
    sourceUrl: 'https://portalguaruja.tur.br/atracoes/praia-do-tombo/',
  },
  {
    id: 'pernambuco-mar-casado',
    name: 'Praia de Pernambuco e Mar Casado',
    city: 'Guarujá',
    lat: -23.9747,
    lon: -46.1912,
    score: 4.9,
    crowd: 'Movimento médio',
    sea: 'Águas tranquilas e cristalinas',
    highlight:
      'Paisagem marcante, com braço de areia que surge na maré baixa e forma um visual único.',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Praia%20de%20Pernambuco.jpg',
    imageCredit: 'Wikimedia Commons',
    sourceLabel: 'Wikimedia Commons e Portal Guarujá de Turismo',
    sourceUrl: 'https://portalguaruja.tur.br/atracoes/praia-de-pernambuco/',
  },
  {
    id: 'eden',
    name: 'Praia do Éden',
    city: 'Guarujá',
    lat: -23.974,
    lon: -46.1969,
    score: 4.8,
    crowd: 'Movimento baixo',
    sea: 'Tom esverdeado',
    highlight:
      'Pequena, escondida e localizada entre Enseada e Mar Casado, com águas claras, mar agitado e acesso por trilha.',
    image:
      'https://portalguaruja.tur.br/wp-content/uploads/2020/09/Praia-do-%C3%89den-Portal-Guaruj%C3%A1-de-Turismo-3.jpg',
    imageCredit: 'Portal Guarujá de Turismo',
    sourceLabel: 'Portal Guarujá de Turismo (uso acadêmico provisório)',
    sourceUrl: 'https://portalguaruja.tur.br/atracoes/praia-do-eden/',
  },
  {
    id: 'guaiuba',
    name: 'Praia do Guaiúba',
    city: 'Guarujá',
    lat: -24.0228,
    lon: -46.2358,
    score: 4.7,
    crowd: 'Movimento tranquilo',
    sea: 'Boa para banho',
    highlight:
      'Cercada pela natureza e casarões, com águas tranquilas, boa para canoagem, stand up paddle e lazer em família.',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/GUARUJ%C3%81-%20PRAIA%20DO%20GUAIUBA%20-%20panoramio.jpg',
    imageCredit: 'Wikimedia Commons',
    sourceLabel: 'Wikimedia Commons e Portal Guarujá de Turismo',
    sourceUrl: 'https://portalguaruja.tur.br/atracoes/praia-do-guaiuba/',
  },
  {
    id: 'iporanga',
    name: 'Praia do Iporanga',
    city: 'Guarujá',
    lat: -23.9206,
    lon: -46.1738,
    score: 4.9,
    crowd: 'Acesso controlado',
    sea: 'Água limpa e segura',
    highlight:
      'Dentro de condomínio, com cachoeira que deságua no mar e ambiente muito preservado.',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Praia-do-iporanga-guaruja-sp-3529-f2.jpg',
    imageCredit: 'Wikimedia Commons',
    sourceLabel: 'Wikimedia Commons e Portal Guarujá de Turismo',
    sourceUrl: 'https://portalguaruja.tur.br/atracoes/praia-do-iporanga/',
  },
  {
    id: 'sao-pedro-conchas',
    name: 'Praia de São Pedro e Praia das Conchas',
    city: 'Guarujá',
    lat: -23.9286,
    lon: -46.1788,
    score: 4.8,
    crowd: 'Acesso controlado',
    sea: 'Mar calmo em área preservada',
    highlight:
      'Acesso controlado em área preservada, com mar agitado em São Pedro e trechos mais calmos nas Conchas, formando piscinas naturais.',
    image:
      'https://portalguaruja.tur.br/wp-content/uploads/2020/09/Praia-de-Sao-Pedro-Adriano-de-Castro-Portal-Guaruj%C3%A1-de-Turismo.jpg',
    imageCredit: 'Portal Guarujá de Turismo',
    sourceLabel: 'Portal Guarujá de Turismo (uso acadêmico provisório)',
    sourceUrl: 'https://portalguaruja.tur.br/atracoes/praia-de-sao-pedro/',
  },
]

const fallbackAttractions: Attraction[] = [
  {
    id: 'vila-belmiro',
    name: 'Vila Belmiro',
    city: 'Santos',
    category: 'Esporte',
    distance: '3,4 km',
    description: 'Estádio do Santos FC, com forte apelo histórico e turístico.',
    address: 'Rua Princesa Isabel, Santos - SP',
    source: 'Curadoria local',
    lat: -23.9511,
    lon: -46.3382,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Vila-Belmiro.webp',
    imageCredit: 'Wikimedia Commons',
  },
  {
    id: 'monumento-zito',
    name: 'Monumento do Zito',
    city: 'Santos',
    category: 'Memória do futebol',
    distance: '3,5 km',
    description: 'Homenagem ao eterno capitão do Santos FC, ao lado da Vila Belmiro.',
    address: 'Rua Princesa Isabel, Vila Belmiro, Santos - SP',
    source: 'Prefeitura de Santos',
    lat: -23.9513,
    lon: -46.3385,
    image: 'https://www.santos.sp.gov.br/../../static/files_www/files/portal_files/isabela_carrari_5224.jpg',
    imageCredit: 'Prefeitura de Santos',
  },
  {
    id: 'aquario',
    name: 'Aquário Municipal',
    city: 'Santos',
    category: 'Família',
    distance: '5,1 km',
    description: 'Passeio clássico para famílias, escolas e visitantes.',
    address: 'Ponta da Praia, Santos - SP',
    source: 'Curadoria local',
    lat: -23.9816,
    lon: -46.2997,
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Aqu%C3%A1rio_Municipal_de_Santos_-_panoramio.jpg',
    imageCredit: 'Wikimedia Commons',
  },
  {
    id: 'estacao-da-cidadania',
    name: 'Estação da Cidadania',
    city: 'Santos',
    category: 'Cultura e comunidade',
    distance: '1,9 km',
    description: 'Espaço cultural e de convivência na Avenida Ana Costa, com programação comunitária e oficinas.',
    address: 'Avenida Ana Costa, 340, Santos - SP',
    source: 'Prefeitura de Santos',
    lat: -23.9586,
    lon: -46.3339,
    image: 'https://www.santos.sp.gov.br/../static/files_www/image_legacy/FRANCISCO%20ARRAIS_9238.JPG',
    imageCredit: 'Prefeitura de Santos',
  },
  {
    id: 'fortaleza',
    name: 'Fortaleza da Barra Grande',
    city: 'Guarujá',
    category: 'História',
    distance: '9,6 km',
    description: 'Paisagem forte, valor histórico e vista para o estuário.',
    address: 'Santa Cruz dos Navegantes, Guarujá - SP',
    source: 'Curadoria local',
    lat: -24.0089,
    lon: -46.3098,
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Fortaleza%20de%20Santo%20Amaro%20da%20Barra%20Grande%20-%20Guaruj%C3%A1%20-%2020221219183521.jpg',
    imageCredit: 'Wikimedia Commons',
  },
]

const routes: Route[] = [
  {
    id: 'orla-santos',
    name: 'Orla de Santos',
    region: 'Santos',
    distanceKm: 11.2,
    calories: 340,
    time: '42 min',
    difficulty: 'Leve',
    highlight: 'Percurso ideal para turistas com vista da orla e vários acessos.',
    destinationLat: -23.9711,
    destinationLon: -46.3088,
  },
  {
    id: 'ponta-praia',
    name: 'Canal 1 até Ponta da Praia',
    region: 'Santos',
    distanceKm: 6.8,
    calories: 215,
    time: '27 min',
    difficulty: 'Leve',
    highlight: 'Trecho curto para usuários iniciantes e deslocamento rápido.',
    destinationLat: -23.9915,
    destinationLon: -46.2997,
  },
  {
    id: 'enseada-panorama',
    name: 'Enseada Panorâmica',
    region: 'Guarujá',
    distanceKm: 9.4,
    calories: 301,
    time: '36 min',
    difficulty: 'Moderada',
    highlight: 'Boa para sightseeing e para integrar praia com pontos turísticos.',
    destinationLat: -23.9887,
    destinationLon: -46.2374,
  },
]

const screens: Array<{
  id: TotemScreen
  label: string
  hint: string
  icon: typeof Compass
}> = [
  { id: 'inicio', label: 'Início', hint: 'Panorama geral', icon: Compass },
  { id: 'praias', label: 'Praias', hint: 'Fotos e notas', icon: Waves },
  { id: 'clima', label: 'Clima', hint: 'Tempo de hoje', icon: CloudSun },
  { id: 'turismo', label: 'Turismo', hint: 'Lugares para visitar', icon: Landmark },
  { id: 'pontos', label: 'Pontos de Santos', hint: 'Locais estratégicos', icon: MapPin },
  { id: 'bike', label: 'Bike', hint: 'Rotas e calorias', icon: Bike },
]

function App() {
  const hasGoogleMapsKey = Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
  const [screen, setScreen] = useState<TotemScreen>('inicio')
  const [selectedBeach, setSelectedBeach] = useState<Beach>(beaches[0])
  const [attractions, setAttractions] = useState<Attraction[]>(fallbackAttractions)
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction>(
    fallbackAttractions[0],
  )
  const [selectedRoute, setSelectedRoute] = useState<Route>(routes[0])
  const [weather, setWeather] = useState<WeatherState>(weatherFallback)
  const [weatherStatus, setWeatherStatus] = useState<
    'idle' | 'loading' | 'ready' | 'fallback'
  >('idle')
  const [attractionsStatus, setAttractionsStatus] = useState<
    'idle' | 'loading' | 'ready' | 'fallback'
  >('idle')

  useEffect(() => {
    const controller = new AbortController()
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

    if (!apiKey) {
      setWeatherStatus('fallback')
      return () => controller.abort()
    }

    const safeApiKey: string = apiKey

    async function loadWeather() {
      try {
        setWeatherStatus('loading')

        const params = new URLSearchParams({
          lat: '-23.9608',
          lon: '-46.3336',
          units: 'metric',
          lang: 'pt_br',
          appid: safeApiKey,
        })

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?${params.toString()}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`OpenWeather returned ${response.status}`)
        }

        const data = (await response.json()) as {
          name: string
          main: { temp: number; humidity: number; feels_like: number }
          wind: { speed: number }
          weather: Array<{ description: string }>
        }

        setWeather({
          city: data.name,
          temp: Math.round(data.main.temp),
          humidity: data.main.humidity,
          feelsLike: Math.round(data.main.feels_like),
          windSpeed: Math.round(data.wind.speed * 3.6),
          description:
            data.weather[0]?.description ?? weatherFallback.description,
        })
        setWeatherStatus('ready')
      } catch {
        if (!controller.signal.aborted) {
          setWeatherStatus('fallback')
          setWeather(weatherFallback)
        }
      }
    }

    void loadWeather()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const geoapifyKey = import.meta.env.VITE_GEOAPIFY_API_KEY

    if (!geoapifyKey) {
      setAttractionsStatus('fallback')
      return () => controller.abort()
    }

    const safeGeoapifyKey: string = geoapifyKey

    async function loadAttractions() {
      try {
        setAttractionsStatus('loading')

        const params = new URLSearchParams({
          categories: 'tourism.attraction,tourism.sights,building.historic',
          filter: 'circle:-46.3336,-23.9608,8000',
          bias: 'proximity:-46.3336,-23.9608',
          limit: '16',
          lang: 'pt',
          apiKey: safeGeoapifyKey,
        })

        const response = await fetch(
          `https://api.geoapify.com/v2/places?${params.toString()}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`Geoapify returned ${response.status}`)
        }

        const data = (await response.json()) as GeoapifyPlacesResponse
        const mapped = mergeCuratedAttractions(
          fallbackAttractions,
          mapGeoapifyAttractions(data),
        )

        if (mapped.length === 0) {
          throw new Error('No attractions returned')
        }

        setAttractions(mapped)
        setSelectedAttraction(mapped[0])
        setAttractionsStatus('ready')
      } catch {
        if (!controller.signal.aborted) {
          setAttractions(fallbackAttractions)
          setSelectedAttraction(fallbackAttractions[0])
          setAttractionsStatus('fallback')
        }
      }
    }

    void loadAttractions()

    return () => controller.abort()
  }, [])

  const stats = useMemo(
    () => [
      { label: 'Praias em destaque', value: `${beaches.length}`, icon: Waves },
      { label: 'Rotas para pedalar', value: `${routes.length}`, icon: Bike },
      { label: 'Pontos turísticos', value: `${attractions.length}`, icon: Landmark },
      { label: 'Média de avaliação', value: '4.7', icon: Star },
    ],
    [],
  )

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_28%),linear-gradient(160deg,_#0f3d4c_0%,_#145a6b_42%,_#efb447_100%)] text-stone-950">
      <div className="mx-auto grid min-h-screen max-w-[1700px] gap-4 px-3 py-3 sm:gap-6 sm:px-4 sm:py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6 lg:py-6">
        <aside className="rounded-[2rem] border border-white/25 bg-stone-950/86 p-5 text-white shadow-[0_30px_120px_rgba(4,18,24,0.35)] backdrop-blur">
          <div className="rounded-[1.75rem] bg-white/6 p-5">
            <span className="inline-flex rounded-full bg-amber-300 px-3 py-1 text-xs font-bold tracking-[0.24em] text-stone-950 uppercase">
              Totem Baixada
            </span>
            <h1 className="mt-4 font-['Sora'] text-3xl font-semibold leading-tight">
              Explore praias, rotas e experiências da região.
            </h1>
            <p className="mt-3 text-sm leading-6 text-stone-300">
              Navegação simples para tela touch, leitura à distância e blocos grandes
              para descoberta rápida.
            </p>
          </div>

          <nav className="mt-6 space-y-3">
            {screens.map(({ id, label, hint, icon: Icon }) => {
              const active = screen === id

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setScreen(id)}
                  className={`w-full rounded-[1.5rem] border p-4 text-left transition ${
                    active
                      ? 'border-amber-300 bg-amber-300 text-stone-950 shadow-lg'
                      : 'border-white/10 bg-white/6 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`rounded-2xl p-3 ${
                        active ? 'bg-stone-950 text-amber-300' : 'bg-white/10'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{label}</p>
                      <p
                        className={`text-sm ${
                          active ? 'text-stone-700' : 'text-stone-300'
                        }`}
                      >
                        {hint}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </nav>

          <div className="mt-6 rounded-[1.5rem] bg-teal-900/70 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs tracking-[0.22em] text-teal-100 uppercase">
                  Clima atual
                </p>
                <p className="mt-2 text-4xl font-semibold">{weather.temp}°C</p>
              </div>
              <CloudSun className="h-11 w-11 text-amber-300" />
            </div>
            <p className="mt-3 text-sm text-teal-50 capitalize">
              {weather.description}
            </p>
            {weatherStatus === 'ready' && (
              <p className="mt-2 text-xs text-teal-100">
                Atualizado para {weather.city}.
              </p>
            )}
          </div>
        </aside>

        <section className="overflow-hidden rounded-[2.2rem] border border-white/30 bg-white/82 shadow-[0_30px_120px_rgba(6,24,35,0.25)] backdrop-blur">
          <header className="border-b border-stone-200/80 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.24em] text-teal-800 uppercase">
                  Experiência do totem
                </p>
                <h2 className="mt-2 font-['Sora'] text-3xl font-semibold lg:text-4xl">
                  {screenTitle(screen)}
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(({ label, value, icon: Icon }) => (
                  <article
                    key={label}
                    className="rounded-[1.3rem] border border-stone-200 bg-stone-50 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs text-stone-500">{label}</p>
                      <Icon className="h-4 w-4 text-teal-800" />
                    </div>
                    <p className="mt-2 text-2xl font-semibold">{value}</p>
                  </article>
                ))}
              </div>
            </div>
          </header>

          <div className="h-full px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
            {screen === 'inicio' && (
              <HomeScreen
                weather={weather}
                onGoToBeach={() => setScreen('praias')}
                onGoToTourism={() => setScreen('turismo')}
                onGoToBike={() => setScreen('bike')}
                beaches={beaches}
                attractions={attractions}
                routes={routes}
              />
            )}

            {screen === 'praias' && (
              <BeachesScreen
                beaches={beaches}
                selectedBeach={selectedBeach}
                onSelectBeach={setSelectedBeach}
              />
            )}

            {screen === 'clima' && (
              <WeatherScreen weather={weather} weatherStatus={weatherStatus} />
            )}

            {screen === 'turismo' && (
              <TourismScreen
                attractions={attractions}
                attractionsStatus={attractionsStatus}
                hasGoogleMapsKey={hasGoogleMapsKey}
                selectedAttraction={selectedAttraction}
                onSelectAttraction={setSelectedAttraction}
              />
            )}

            {screen === 'pontos' && (
              <PontosScreen onGoToBike={() => setScreen('bike')} />
            )}

            {screen === 'bike' && (
              <BikeScreen
                hasGoogleMapsKey={hasGoogleMapsKey}
                routes={routes}
                selectedRoute={selectedRoute}
                onSelectRoute={setSelectedRoute}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

function HomeScreen({
  weather,
  beaches,
  attractions,
  routes,
  onGoToBeach,
  onGoToTourism,
  onGoToBike,
}: {
  weather: WeatherState
  beaches: Beach[]
  attractions: Attraction[]
  routes: Route[]
  onGoToBeach: () => void
  onGoToTourism: () => void
  onGoToBike: () => void
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
      <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(145deg,_rgba(15,61,76,0.96),_rgba(20,90,107,0.94)),url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center p-5 text-white sm:p-7">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full bg-white/14 px-4 py-1 text-xs font-bold tracking-[0.24em] uppercase">
            Roteiro em destaque
          </span>
          <h3 className="mt-5 font-['Sora'] text-2xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Uma interface de totem pronta para guiar turistas pela Baixada Santista.
          </h3>
          <p className="mt-4 max-w-xl text-base leading-7 text-teal-50/90">
            A experiência agora está dividida em telas reais: praias, clima, turismo
            e bike. Isso deixa o fluxo mais prático para toque, descoberta e leitura
            pública.
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <QuickAccessCard
            title="Praias"
            subtitle={`${beaches.length} destaques com foto e avaliação`}
            icon={Waves}
            actionLabel="Abrir praias"
            onClick={onGoToBeach}
          />
          <QuickAccessCard
            title="Turismo"
            subtitle={`${attractions.length} pontos para visitar`}
            icon={MapPinned}
            actionLabel="Abrir turismo"
            onClick={onGoToTourism}
          />
          <QuickAccessCard
            title="Bike"
            subtitle={`${routes.length} rotas com distância e calorias`}
            icon={Bike}
            actionLabel="Abrir bike"
            onClick={onGoToBike}
          />
        </div>
      </section>

      <div className="grid gap-6">
        <section className="rounded-[2rem] bg-[#fff7e8] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-amber-800 uppercase">
                Clima do dia
              </p>
              <h3 className="mt-2 font-['Sora'] text-3xl font-semibold">
                {weather.temp}°C em {weather.city}
              </h3>
            </div>
            <SunMedium className="h-11 w-11 text-amber-600" />
          </div>
          <p className="mt-4 text-base capitalize text-stone-600">
            {weather.description}
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <MetricCard
              icon={Droplets}
              label="Umidade"
              value={`${weather.humidity}%`}
              tone="light"
            />
            <MetricCard
              icon={Wind}
              label="Vento"
              value={`${weather.windSpeed} km/h`}
              tone="light"
            />
            <MetricCard
              icon={CloudSun}
              label="Sensação"
              value={`${weather.feelsLike}°C`}
              tone="light"
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-stone-200 bg-white p-6">
          <p className="text-sm font-semibold tracking-[0.22em] text-teal-800 uppercase">
            Fluxo do totem
          </p>
          <div className="mt-5 grid gap-3">
            {['1. Escolha uma categoria', '2. Veja cards grandes e visuais', '3. Abra detalhes do destino ou da rota'].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-[1.25rem] bg-stone-100 px-4 py-4 text-sm font-medium text-stone-700"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function BeachesScreen({
  beaches,
  selectedBeach,
  onSelectBeach,
}: {
  beaches: Beach[]
  selectedBeach: Beach
  onSelectBeach: (beach: Beach) => void
}) {
  const [cityFilter, setCityFilter] = useState<'Todas' | 'Santos' | 'Guarujá'>('Todas')
  const detailRef = useRef<HTMLElement>(null)

  const handleSelectBeach = (beach: Beach) => {
    onSelectBeach(beach)
    scrollDetailIntoView(detailRef.current)
  }

  const filteredBeaches =
    cityFilter === 'Todas'
      ? beaches
      : beaches.filter((beach) => beach.city === cityFilter)

  const visibleSelectedBeach = filteredBeaches.some(
    (beach) => beach.id === selectedBeach.id,
  )
    ? selectedBeach
    : filteredBeaches[0]

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.2fr]">
      <section>
        <div className="mb-4 flex flex-wrap gap-3">
          {(['Todas', 'Santos', 'Guarujá'] as const).map((filter) => {
            const active = cityFilter === filter

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setCityFilter(filter)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? 'bg-teal-950 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {filter}
              </button>
            )
          })}
        </div>

        <p className="mb-4 text-sm text-stone-500">
          {cityFilter === 'Todas'
            ? `${beaches.length} praias curadas de Santos e Guarujá.`
            : `${filteredBeaches.length} praias em ${cityFilter}.`}
        </p>

        <div className="space-y-4">
          {filteredBeaches.map((beach) => {
            const active = beach.id === visibleSelectedBeach.id

            return (
              <button
                key={beach.id}
                type="button"
                onClick={() => handleSelectBeach(beach)}
                className={`w-full rounded-[1.7rem] border p-4 text-left transition ${
                  active
                    ? 'border-teal-900 bg-teal-950 text-white'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  {beach.image ? (
                    <img
                      src={beach.image}
                      alt={beach.name}
                      className="h-24 w-28 rounded-[1.2rem] object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-28 items-center justify-center rounded-[1.2rem] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_40%),linear-gradient(160deg,_#0f3d4c_0%,_#145a6b_55%,_#efb447_100%)] p-3 text-center text-white">
                      <div>
                        <Waves className="mx-auto h-6 w-6 text-amber-300" />
                        <p className="mt-2 text-[11px] font-semibold uppercase text-white/90">
                          Sem foto
                        </p>
                        <p className="mt-1 text-[10px] text-white/75">verificada</p>
                      </div>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold">{beach.name}</h3>
                      <div
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
                          active
                            ? 'bg-amber-300 text-stone-950'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        <Star className="h-4 w-4 fill-current" />
                        {beach.score}
                      </div>
                    </div>
                    <p
                      className={`mt-1 text-sm ${
                        active ? 'text-teal-100' : 'text-stone-500'
                      }`}
                    >
                      {beach.city}
                    </p>
                    <p
                      className={`mt-3 text-sm leading-6 ${
                        active ? 'text-stone-100' : 'text-stone-600'
                      }`}
                    >
                      {beach.highlight}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section
        ref={detailRef}
        className="scroll-mt-4 overflow-hidden rounded-[2rem] border border-stone-200 bg-white"
      >
        <div className="relative h-72 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_40%),linear-gradient(160deg,_#0f3d4c_0%,_#145a6b_55%,_#efb447_100%)]">
          {visibleSelectedBeach.image ? (
            <img
              src={visibleSelectedBeach.image}
              alt={visibleSelectedBeach.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center text-white">
              <div className="max-w-sm">
                <Waves className="mx-auto h-10 w-10 text-amber-300" />
                <p className="mt-4 text-2xl font-semibold">Sem foto verificada desta praia</p>
                <p className="mt-3 text-sm leading-6 text-white/80">
                  Preferi remover imagens ilustrativas para não sugerir uma paisagem
                  que pode não corresponder ao local real.
                </p>
              </div>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-6 py-5 text-white">
            <p className="text-sm font-semibold tracking-[0.22em] uppercase text-amber-300">
              {visibleSelectedBeach.image ? 'Foto verificada' : 'Visual em modo rigoroso'}
            </p>
            <p className="mt-2 text-sm text-white/85">{visibleSelectedBeach.sourceLabel}</p>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-teal-800 uppercase">
                Praia selecionada
              </p>
              <h3 className="mt-2 font-['Sora'] text-3xl font-semibold">
                {visibleSelectedBeach.name}
              </h3>
              <p className="mt-2 text-base text-stone-500">{visibleSelectedBeach.city}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 font-semibold text-amber-700">
              <Star className="h-4 w-4 fill-current" />
              {visibleSelectedBeach.score} de avaliação
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600">
            {visibleSelectedBeach.highlight}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <InfoPanel label="Movimento" value={visibleSelectedBeach.crowd} />
            <InfoPanel label="Condição do mar" value={visibleSelectedBeach.sea} />
            <InfoPanel label="Uso ideal" value="Passeio, foto e descanso" />
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[1.35fr_0.8fr]">
            <div className="overflow-hidden rounded-[1.7rem] border border-stone-200 bg-stone-100 p-2">
              <MiniPlaceMap
                lat={visibleSelectedBeach.lat}
                lon={visibleSelectedBeach.lon}
                label={visibleSelectedBeach.name}
              />
            </div>

            <div className="rounded-[1.7rem] bg-[linear-gradient(160deg,_#0f3d4c_0%,_#145a6b_58%,_#efb447_100%)] p-5 text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-2 text-sm font-semibold text-white/92 backdrop-blur">
                <MapPinned className="h-4 w-4 text-amber-300" />
                Localização em destaque
              </div>

              <h4 className="mt-4 font-['Sora'] text-2xl font-semibold">
                {visibleSelectedBeach.name}
              </h4>
              <p className="mt-2 text-sm text-white/80">
                {visibleSelectedBeach.city}, Baixada Santista
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-[1.2rem] bg-black/16 p-4 backdrop-blur">
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-300">
                    Faixa litorânea
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/88">
                    Orla urbana com acesso rápido para passeio, observação da vista e
                    navegação externa.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-[1.2rem] bg-white/12 p-4 backdrop-blur">
                    <p className="text-xs font-semibold tracking-[0.18em] uppercase text-white/72">
                      Latitude
                    </p>
                    <p className="mt-2 text-base font-semibold">
                      {visibleSelectedBeach.lat.toFixed(4)}
                    </p>
                  </div>
                  <div className="rounded-[1.2rem] bg-white/12 p-4 backdrop-blur">
                    <p className="text-xs font-semibold tracking-[0.18em] uppercase text-white/72">
                      Longitude
                    </p>
                    <p className="mt-2 text-base font-semibold">
                      {visibleSelectedBeach.lon.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-white/78">
                O mapa ao lado mostra o ponto central da praia para facilitar a consulta
                visual no totem antes de abrir a navegação.
              </p>
            </div>
          </div>

          {visibleSelectedBeach.communitySourceUrl && (
            <div className="mt-6 rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-semibold tracking-[0.18em] text-stone-500 uppercase">
                Avaliação da comunidade
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-stone-800">
                    {visibleSelectedBeach.communitySourceLabel}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    {visibleSelectedBeach.communityScore
                      ? `${visibleSelectedBeach.communityScore.toFixed(1).replace('.', ',')} de 5`
                      : 'Ver avaliações da comunidade'}
                    {visibleSelectedBeach.communityReviews
                      ? ` (${visibleSelectedBeach.communityReviews} avaliações)`
                      : ''}
                  </p>
                </div>
                <a
                  href={visibleSelectedBeach.communitySourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800"
                >
                  Ver avaliações no Tripadvisor
                </a>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-500">
                As fotos do Tripadvisor não foram incorporadas ao projeto. Usei o site
                como referência de avaliações da comunidade e mantive no app apenas
                imagens curadas sem foco em pessoas.
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={googleMapsSearchUrl(
                `${visibleSelectedBeach.name}, ${visibleSelectedBeach.city}, SP`,
              )}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-stone-950"
            >
              Abrir no Google Maps
            </a>
            {visibleSelectedBeach.sourceUrl && (
              <a
                href={visibleSelectedBeach.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-teal-950 px-5 py-3 text-sm font-semibold text-white"
              >
                Abrir referência da praia
              </a>
            )}
            <span className="self-center text-sm text-stone-500">
              {visibleSelectedBeach.image
                ? `Imagem verificada: ${visibleSelectedBeach.imageCredit ?? visibleSelectedBeach.sourceLabel}.`
                : 'Sem foto verificada por enquanto; a praia segue com dados textuais confiáveis.'}
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

function WeatherScreen({
  weather,
  weatherStatus,
}: {
  weather: WeatherState
  weatherStatus: 'idle' | 'loading' | 'ready' | 'fallback'
}) {
  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] bg-teal-950 p-7 text-white">
        <p className="text-sm font-semibold tracking-[0.24em] text-teal-200 uppercase">
          Painel de clima
        </p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="font-['Sora'] text-6xl font-semibold">{weather.temp}°C</h3>
            <p className="mt-3 text-lg capitalize text-teal-50">
              {weather.description}
            </p>
            <p className="mt-2 text-sm text-teal-200">
              {weatherStatus === 'ready'
                ? 'Leitura de clima atualizada.'
                : weatherStatus === 'loading'
                  ? 'Atualizando dados de clima...'
                  : 'Dados de hoje para Santos.'}
            </p>
          </div>
          <CloudSun className="h-24 w-24 text-amber-300" />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <MetricCard
            icon={Droplets}
            label="Umidade"
            value={`${weather.humidity}%`}
            tone="dark"
          />
          <MetricCard
            icon={Wind}
            label="Vento"
            value={`${weather.windSpeed} km/h`}
            tone="dark"
          />
          <MetricCard
            icon={CloudSun}
            label="Sensação"
            value={`${weather.feelsLike}°C`}
            tone="dark"
          />
        </div>
      </section>
    </div>
  )
}

function TourismScreen({
  attractions,
  attractionsStatus,
  hasGoogleMapsKey,
  selectedAttraction,
  onSelectAttraction,
}: {
  attractions: Attraction[]
  attractionsStatus: 'idle' | 'loading' | 'ready' | 'fallback'
  hasGoogleMapsKey: boolean
  selectedAttraction: Attraction
  onSelectAttraction: (attraction: Attraction) => void
}) {
  const detailRef = useRef<HTMLElement>(null)

  const handleSelectAttraction = (attraction: Attraction) => {
    onSelectAttraction(attraction)
    scrollDetailIntoView(detailRef.current)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.15fr]">
      <section className="grid gap-4">
        {attractions.map((attraction) => {
          const active = attraction.id === selectedAttraction.id

          return (
            <button
              key={attraction.id}
              type="button"
              onClick={() => handleSelectAttraction(attraction)}
              className={`overflow-hidden rounded-[1.7rem] border text-left transition ${
                active
                  ? 'border-amber-300 bg-[#fff7e8]'
                  : 'border-stone-200 bg-white hover:bg-stone-50'
              }`}
            >
              <div className="grid md:grid-cols-[128px_1fr]">
                {attraction.image ? (
                  <div className="relative min-h-32 overflow-hidden">
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/90">
                        Foto real
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-32 items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_40%),linear-gradient(160deg,_#0f3d4c_0%,_#145a6b_55%,_#efb447_100%)] p-4 text-center text-white">
                    <div>
                      <MapPinned className="mx-auto h-7 w-7 text-amber-300" />
                      <p className="mt-3 text-xs font-semibold tracking-[0.2em] uppercase text-teal-100">
                        {attraction.category}
                      </p>
                      <p className="mt-2 text-sm font-semibold">{attraction.distance}</p>
                      <p className="mt-2 text-xs text-white/80">Sem foto verificada</p>
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold">{attraction.name}</h3>
                    <span className="rounded-full bg-stone-950 px-3 py-1 text-xs font-semibold text-white">
                      {attraction.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-stone-500">
                    {attraction.city} • {attraction.distance}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {attraction.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </section>

      <section
        ref={detailRef}
        className="scroll-mt-4 overflow-hidden rounded-[2rem] bg-stone-950 text-white"
      >
        <div className="relative h-80 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_30%),linear-gradient(160deg,_#102f3b_0%,_#15586a_52%,_#efb447_100%)]">
          {selectedAttraction.image ? (
            <img
              src={selectedAttraction.image}
              alt={selectedAttraction.name}
              className="h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 flex items-end p-6">
            <div className="w-full rounded-[1.7rem] border border-white/10 bg-black/35 p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold tracking-[0.22em] text-amber-300 uppercase">
                {selectedAttraction.image ? 'Foto real do local' : 'Lugar real via Geoapify'}
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-stone-100">
                <span className="rounded-full bg-white/10 px-3 py-2">
                  {selectedAttraction.category}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-2">
                  {selectedAttraction.distance}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-2">
                  {selectedAttraction.source}
                </span>
                {selectedAttraction.imageCredit && (
                  <span className="rounded-full bg-white/10 px-3 py-2">
                    {selectedAttraction.imageCredit}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm font-semibold tracking-[0.22em] text-amber-300 uppercase">
            Destaque turístico
          </p>
          <h3 className="mt-2 font-['Sora'] text-3xl font-semibold">
            {selectedAttraction.name}
          </h3>
          <p className="mt-2 text-stone-300">
            {selectedAttraction.city} • {selectedAttraction.distance}
          </p>
          <p className="mt-5 text-base leading-7 text-stone-200">
            {selectedAttraction.description}
          </p>
          <p className="mt-4 text-sm leading-6 text-stone-300">
            {selectedAttraction.address}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={googleMapsSearchUrl(
                `${selectedAttraction.name}, ${selectedAttraction.city}`,
              )}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-stone-950"
            >
              Abrir no Google Maps
            </a>
            {selectedAttraction.website && (
              <a
                href={selectedAttraction.website}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white"
              >
                Site oficial
              </a>
            )}
            <span className="self-center text-sm text-stone-300">
              {attractionsStatus === 'ready'
                ? 'Lista carregada com lugares reais encontrados perto de Santos.'
                : hasGoogleMapsKey
                  ? 'Dados locais em fallback; a API do Google ainda precisa ser ativada para consultas oficiais.'
                  : 'Você ainda pode usar o link direto do Google Maps sem Places API.'}
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <InfoPanelDark label="Categoria" value={selectedAttraction.category} />
            <InfoPanelDark label="Perfil" value="Famílias e turistas" />
            <InfoPanelDark label="Origem" value={selectedAttraction.source} />
          </div>

          <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/6 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-lg font-semibold">Mapa do local</p>
              <span className="text-sm text-stone-300">OpenStreetMap na própria tela</span>
            </div>
            <MiniPlaceMap
              lat={selectedAttraction.lat}
              lon={selectedAttraction.lon}
              label={selectedAttraction.name}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function PontosScreen({ onGoToBike }: { onGoToBike: () => void }) {
  const [filtro, setFiltro] = useState<FiltroPonto>('Todos')
  const [busca, setBusca] = useState('')
  const [pontoSelecionado, setPontoSelecionado] = useState<PontoSantos | null>(null)

  const pontosFiltrados = useMemo(
    () => filtrarPontos(pontosSantos, filtro, busca),
    [filtro, busca],
  )

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-[linear-gradient(150deg,_rgba(15,61,76,0.96),_rgba(20,90,107,0.94))] p-6 text-white lg:p-7">
        <span className="inline-flex rounded-full bg-amber-300 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-stone-950">
          Guia da cidade
        </span>
        <h3 className="mt-4 font-['Sora'] text-3xl font-semibold leading-tight lg:text-4xl">
          Pontos estratégicos de Santos para explorar de bike.
        </h3>
        <p className="mt-3 max-w-2xl text-base leading-7 text-teal-50/90">
          Turismo, cultura, compras, alimentação e apoio ao ciclista — filtre por
          categoria, busque pelo nome e toque em um card para ver os detalhes.
        </p>
      </section>

      <FiltroPontos
        filtroAtivo={filtro}
        onFiltroChange={setFiltro}
        busca={busca}
        onBuscaChange={setBusca}
      />

      <p className="text-sm font-medium text-stone-500">
        {pontosFiltrados.length === 0
          ? 'Nenhum ponto encontrado para esse filtro ou busca.'
          : `${pontosFiltrados.length} ${
              pontosFiltrados.length === 1 ? 'ponto encontrado' : 'pontos encontrados'
            }.`}
      </p>

      {pontosFiltrados.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {pontosFiltrados.map((ponto) => (
            <PontoCard
              key={ponto.id}
              ponto={ponto}
              onVerDetalhes={setPontoSelecionado}
              onVerRota={onGoToBike}
            />
          ))}
        </div>
      )}

      <PontoDetalhesModal
        ponto={pontoSelecionado}
        onClose={() => setPontoSelecionado(null)}
      />
    </div>
  )
}

function BikeScreen({
  hasGoogleMapsKey,
  routes,
  selectedRoute,
  onSelectRoute,
}: {
  hasGoogleMapsKey: boolean
  routes: Route[]
  selectedRoute: Route
  onSelectRoute: (route: Route) => void
}) {
  const detailRef = useRef<HTMLElement>(null)

  const handleSelectRoute = (route: Route) => {
    onSelectRoute(route)
    scrollDetailIntoView(detailRef.current)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.94fr_1.1fr]">
      <section className="space-y-4">
        {routes.map((route) => {
          const active = route.id === selectedRoute.id

          return (
            <button
              key={route.id}
              type="button"
              onClick={() => handleSelectRoute(route)}
              className={`w-full rounded-[1.7rem] border p-5 text-left transition ${
                active
                  ? 'border-teal-900 bg-teal-950 text-white'
                  : 'border-stone-200 bg-white hover:bg-stone-50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{route.name}</h3>
                  <p
                    className={`mt-1 text-sm ${
                      active ? 'text-teal-200' : 'text-stone-500'
                    }`}
                  >
                    {route.region} • Dificuldade {route.difficulty}
                  </p>
                </div>
                <Navigation className="h-6 w-6 text-amber-300" />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
                <TileMetric
                  label="Distância"
                  value={`${route.distanceKm.toFixed(1)} km`}
                  active={active}
                />
                <TileMetric
                  label="Calorias"
                  value={`${route.calories} kcal`}
                  active={active}
                />
                <TileMetric label="Tempo" value={route.time} active={active} />
              </div>
            </button>
          )
        })}
      </section>

      <section
        ref={detailRef}
        className="scroll-mt-4 rounded-[2rem] border border-stone-200 bg-[#edf7f7] p-6"
      >
        <p className="text-sm font-semibold tracking-[0.22em] text-teal-800 uppercase">
          Rota selecionada
        </p>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-['Sora'] text-3xl font-semibold">
              {selectedRoute.name}
            </h3>
            <p className="mt-2 text-stone-500">
              {selectedRoute.region} • Dificuldade {selectedRoute.difficulty}
            </p>
          </div>
          <div className="rounded-full bg-amber-300 px-4 py-2 text-sm font-bold text-stone-950">
            Rota recomendada
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600">
          {selectedRoute.highlight}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoPanel
            label="Distancia total"
            value={`${selectedRoute.distanceKm.toFixed(1)} km`}
          />
          <InfoPanel label="Gasto médio" value={`${selectedRoute.calories} kcal`} />
          <InfoPanel label="Tempo estimado" value={selectedRoute.time} />
        </div>

        <div className="mt-6 rounded-[1.6rem] bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-semibold">Mapa da rota</p>
            <span className="text-sm text-stone-500">Visualização com OpenStreetMap</span>
          </div>
          <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-stone-200">
            <MiniRouteMap
              fromLat={KIOSK_ORIGIN.lat}
              fromLon={KIOSK_ORIGIN.lon}
              toLat={selectedRoute.destinationLat}
              toLon={selectedRoute.destinationLon}
              destinationLabel={selectedRoute.name}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-sm text-stone-500">
              {hasGoogleMapsKey
                ? 'A abertura externa continua no Google Maps, sem depender de Places API.'
                : 'Você pode abrir a navegação no Google Maps por link direto, mesmo sem Places API.'}
            </p>
            <a
              href={googleMapsDirectionsUrl(
                `${selectedRoute.name}, ${selectedRoute.region}, Baixada Santista`,
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-teal-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Abrir rota no Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

function QuickAccessCard({
  title,
  subtitle,
  icon: Icon,
  actionLabel,
  onClick,
}: {
  title: string
  subtitle: string
  icon: typeof Compass
  actionLabel: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[1.6rem] border border-white/15 bg-white/10 p-5 text-left backdrop-blur transition hover:bg-white/16"
    >
      <Icon className="h-7 w-7 text-amber-300" />
      <p className="mt-4 text-xl font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-teal-50/85">{subtitle}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-300">
        {actionLabel}
        <ChevronRight className="h-4 w-4" />
      </span>
    </button>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Droplets
  label: string
  value: string
  tone: 'light' | 'dark'
}) {
  return (
    <div
      className={`rounded-[1.4rem] p-4 text-center text-sm shadow-sm ${
        tone === 'dark' ? 'bg-white/10' : 'bg-white'
      }`}
    >
      <Icon
        className={`mx-auto h-5 w-5 ${
          tone === 'dark' ? 'text-amber-300' : 'text-teal-800'
        }`}
      />
      <p className={`mt-2 ${tone === 'dark' ? 'text-stone-300' : 'text-stone-500'}`}>
        {label}
      </p>
      <p className={`mt-1 text-lg font-semibold ${tone === 'dark' ? 'text-white' : ''}`}>
        {value}
      </p>
    </div>
  )
}

function InfoPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] bg-stone-100 p-4">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  )
}

function InfoPanelDark({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] bg-white/6 p-4">
      <p className="text-sm text-stone-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  )
}

function TileMetric({
  label,
  value,
  active,
}: {
  label: string
  value: string
  active: boolean
}) {
  return (
    <div
      className={`rounded-[1.1rem] p-3 ${
        active ? 'bg-white/8' : 'bg-stone-100 text-stone-900'
      }`}
    >
      <p className={active ? 'text-teal-200' : 'text-stone-500'}>{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  )
}

function MiniPlaceMap({
  lat,
  lon,
  label,
}: {
  lat: number
  lon: number
  label: string
}) {
  return (
    <div className="h-64 w-full overflow-hidden rounded-[1.2rem]">
      <iframe
        title={`Mapa de ${label}`}
        src={openStreetMapEmbedUrl(lat, lon, 0.012)}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="pointer-events-none relative -mt-14 px-4 pb-4">
        <div className="inline-flex rounded-full bg-stone-950/82 px-3 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur">
          {label}
        </div>
      </div>
    </div>
  )
}

function MiniRouteMap({
  fromLat,
  fromLon,
  toLat,
  toLon,
  destinationLabel,
}: {
  fromLat: number
  fromLon: number
  toLat: number
  toLon: number
  destinationLabel: string
}) {
  const centerLat = (fromLat + toLat) / 2
  const centerLon = (fromLon + toLon) / 2

  return (
    <div className="h-64 w-full">
      <iframe
        title={`Mapa da rota para ${destinationLabel}`}
        src={openStreetMapEmbedUrl(centerLat, centerLon, 0.03)}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="pointer-events-none relative -mt-14 flex justify-between px-4 pb-4 text-sm font-semibold text-white">
        <span className="rounded-full bg-teal-900/88 px-3 py-2 shadow-lg backdrop-blur">
          Totem
        </span>
        <span className="rounded-full bg-stone-950/82 px-3 py-2 shadow-lg backdrop-blur">
          {destinationLabel}
        </span>
      </div>
    </div>
  )
}

// No mobile/tablet (abaixo de xl) o painel de detalhe fica empilhado embaixo
// da lista. Ao tocar num card, rolamos suavemente até ele.
function scrollDetailIntoView(element: HTMLElement | null) {
  if (element && typeof window !== 'undefined' && window.innerWidth < 1280) {
    requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
}

function screenTitle(screen: TotemScreen) {
  switch (screen) {
    case 'inicio':
      return 'Painel inicial do totem'
    case 'praias':
      return 'Praias com selecao e detalhes'
    case 'clima':
      return 'Clima do dia'
    case 'turismo':
      return 'Pontos turísticos em destaque'
    case 'pontos':
      return 'Pontos estratégicos de Santos'
    case 'bike':
      return 'Rotas de bicicleta e dados de esforço'
    default:
      return 'Totem Baixada Santista'
  }
}

type GeoapifyPlacesResponse = {
  features: Array<{
    properties: {
      place_id: string
      name?: string
      city?: string
      formatted?: string
      address_line2?: string
      distance?: number
      description?: string
      website?: string
      categories?: string[]
      datasource?: { sourcename?: string }
      wiki_and_media?: {
        wikidata?: string
        wikimedia_commons?: string
      }
      lon: number
      lat: number
      historic?: { type?: string }
      building?: { type?: string }
    }
  }>
}

function mapGeoapifyAttractions(data: GeoapifyPlacesResponse): Attraction[] {
  const seen = new Set<string>()

  return data.features
    .filter((feature) => feature.properties.name)
    .map((feature) => {
      const properties = feature.properties

      return {
        id: properties.place_id,
        name: properties.name ?? 'Lugar sem nome',
        city: properties.city ?? 'Baixada Santista',
        category: toAttractionCategory(properties.categories ?? []),
        distance: formatMeters(properties.distance),
        description:
          properties.description ??
          describeAttraction(properties.name ?? 'Local', properties.categories ?? []),
        address:
          properties.address_line2 ??
          properties.formatted ??
          'Endereço não informado',
        source: formatSource(properties.datasource?.sourcename),
        lat: properties.lat,
        lon: properties.lon,
        website: properties.website,
        image: wikimediaImageUrl(properties.wiki_and_media?.wikimedia_commons),
        imageCredit: properties.wiki_and_media?.wikimedia_commons
          ? 'Wikimedia Commons'
          : undefined,
      } satisfies Attraction
    })
    .sort((a, b) => attractionScore(b) - attractionScore(a))
    .filter((attraction) => {
      const key = attraction.name.toLowerCase()

      if (seen.has(key)) {
        return false
      }

      seen.add(key)
      return true
    })
    .slice(0, 6)
}

function mergeCuratedAttractions(
  curated: Attraction[],
  fetched: Attraction[],
): Attraction[] {
  const curatedKeys = new Set(curated.map((item) => attractionKey(item.name, item.city)))

  const mergedFetched = fetched
    .map((item) => {
      const curatedMatch = curated.find(
        (curatedItem) =>
          attractionKey(curatedItem.name, curatedItem.city) ===
          attractionKey(item.name, item.city),
      )

      if (!curatedMatch) {
        return item
      }

      return {
        ...item,
        ...curatedMatch,
        website: curatedMatch.website ?? item.website,
        image: curatedMatch.image ?? item.image,
        imageCredit: curatedMatch.imageCredit ?? item.imageCredit,
        source: curatedMatch.source ?? item.source,
      }
    })
    .filter((item) => !curatedKeys.has(attractionKey(item.name, item.city)))

  return [...curated, ...mergedFetched].slice(0, 6)
}

function attractionKey(name: string, city: string) {
  return `${normalizeText(name)}::${normalizeText(city)}`
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

function toAttractionCategory(categories: string[]) {
  if (categories.some((category) => category.includes('memorial'))) {
    return 'Memorial'
  }

  if (categories.some((category) => category.includes('historic'))) {
    return 'Histórico'
  }

  if (categories.some((category) => category.includes('tourism.sights'))) {
    return 'Atração'
  }

  return 'Turismo'
}

function describeAttraction(name: string, categories: string[]) {
  if (categories.some((category) => category.includes('memorial'))) {
    return `${name} é um ponto de memória urbana que ajuda a contar a história local.`
  }

  if (categories.some((category) => category.includes('historic'))) {
    return `${name} se destaca pelo valor histórico e pelo interesse cultural na região.`
  }

  return `${name} aparece como ponto de interesse turístico próximo na base da Geoapify.`
}

function formatMeters(distance?: number) {
  if (distance === undefined) {
    return 'Distância não informada'
  }

  if (distance < 1000) {
    return `${distance} m`
  }

  return `${(distance / 1000).toFixed(1)} km`
}

function formatSource(source?: string) {
  if (!source) {
    return 'Base externa'
  }

  if (source === 'openstreetmap') {
    return 'OpenStreetMap'
  }

  return source
}

function attractionScore(attraction: Attraction) {
  let score = 0

  if (attraction.website) {
    score += 3
  }

  if (attraction.image) {
    score += 6
  }

  if (attraction.description && !attraction.description.includes('Geoapify')) {
    score += 2
  }

  if (attraction.category === 'Histórico') {
    score += 2
  }

  if (attraction.category === 'Atração') {
    score += 1
  }

  if (attraction.category === 'Memorial') {
    score -= 1
  }

  return score
}

function wikimediaImageUrl(fileName?: string) {
  if (!fileName) {
    return undefined
  }

  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`
}

const KIOSK_ORIGIN = {
  lat: -23.9608,
  lon: -46.3336,
}

function googleMapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

function googleMapsDirectionsUrl(destination: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=bicycling`
}

function openStreetMapEmbedUrl(lat: number, lon: number, delta: number) {
  const left = lon - delta
  const bottom = lat - delta
  const right = lon + delta
  const top = lat + delta

  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lon}`
}

export default App
