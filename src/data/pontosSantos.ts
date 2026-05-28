// Pontos estratégicos de Santos para o totem de autoatendimento.
// As imagens são caminhos locais em /public/images/pontos-santos/.
// Caso o arquivo ainda não exista, o card exibe um placeholder elegante.

export type NivelRecomendacao =
  | 'Parada rápida'
  | 'Ponto turístico'
  | 'Ponto de alimentação'
  | 'Ponto de descanso'
  | 'Ponto de compras'

export type PontoSantos = {
  id: string
  nome: string
  categoria: CategoriaPonto
  bairro: string
  descricao: string
  /** Texto mais longo exibido no modal de detalhes. */
  descricaoCompleta?: string
  endereco: string
  /** Caminho local. Ex.: /images/pontos-santos/aquario-municipal.jpg */
  imagem: string
  /**
   * Foto pública (Wikimedia Commons) exibida enquanto não há arquivo local.
   * O card tenta a remota primeiro; se falhar, usa a local; se faltar, placeholder.
   * Para trocar pela sua própria foto, basta adicionar o arquivo em `imagem`.
   */
  imagemRemota?: string
  /** Coordenadas aproximadas para o mini-mapa (OpenStreetMap). */
  lat: number
  lon: number
  /** Tags livres usadas em filtros e badges (minúsculas). */
  tipoApoio: string[]
  recomendadoParaBike: boolean
  destaque: boolean
  nivelRecomendacao: NivelRecomendacao
  /** Sugestão de uso no trajeto de bike. */
  sugestaoBike?: string
  /** Nomes das rotas de bicicleta às quais o ponto pertence. */
  rotas: string[]
}

export type CategoriaPonto =
  | 'Turismo'
  | 'Praia e Orla'
  | 'Compras'
  | 'Alimentação'
  | 'Apoio ao Ciclista'
  | 'Cultura'

// Rótulos das rotas de bike (alinhados aos roteiros do totem).
export const ROTA_ORLA = 'Rota Orla'
export const ROTA_CENTRO = 'Rota Centro Histórico'
export const ROTA_GONZAGA = 'Rota Gonzaga / Compras'

function img(file: string) {
  return `/images/pontos-santos/${file}`
}

// Foto pública do Wikimedia Commons (Special:FilePath resolve para o arquivo real).
// URLs verificadas (HTTP 302) em mai/2026.
function wiki(file: string) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}`
}

export const pontosSantos: PontoSantos[] = [
  // ----------------------------- TURISMO E CULTURA -----------------------------
  {
    id: 'aquario-municipal',
    nome: 'Aquário Municipal de Santos',
    categoria: 'Turismo',
    bairro: 'Ponta da Praia',
    descricao:
      'Um dos principais pontos turísticos de Santos, ideal para visitantes e famílias.',
    descricaoCompleta:
      'O Aquário Municipal é o cartão-postal da Ponta da Praia, com tanques marinhos, pinguins e exposições. Parada obrigatória para famílias e ótimo ponto final para quem pedala pela orla.',
    endereco: 'Praça Luiz La Scala, s/nº, Ponta da Praia, Santos - SP',
    imagem: img('aquario-municipal.jpg'),
    imagemRemota: wiki('Frente_do_Aquário_e_entrada.JPG'),
    lat: -23.9816,
    lon: -46.2997,
    tipoApoio: ['turismo', 'família', 'parada leve'],
    recomendadoParaBike: true,
    destaque: true,
    nivelRecomendacao: 'Ponto turístico',
    sugestaoBike: 'Fim de linha da orla: estacione a bike e visite com a família.',
    rotas: [ROTA_ORLA],
  },
  {
    id: 'museu-do-cafe',
    nome: 'Museu do Café',
    categoria: 'Cultura',
    bairro: 'Centro',
    descricao:
      'Antiga Bolsa do Café, hoje museu que conta a história do ouro verde de Santos.',
    descricaoCompleta:
      'Instalado no prédio histórico da Bolsa Oficial de Café, reúne acervo, cafeteria e o famoso pregão. Coração do Centro Histórico e excelente parada cultural.',
    endereco: 'Rua XV de Novembro, 95, Centro, Santos - SP',
    imagem: img('museu-do-cafe.jpg'),
    imagemRemota: wiki('Coffee_Museum_(Q9660690).jpg'),
    lat: -23.9329,
    lon: -46.3287,
    tipoApoio: ['cultura', 'turismo', 'café'],
    recomendadoParaBike: true,
    destaque: true,
    nivelRecomendacao: 'Ponto turístico',
    sugestaoBike: 'Pausa cultural com café no meio da Rota Centro Histórico.',
    rotas: [ROTA_CENTRO],
  },
  {
    id: 'monte-serrat',
    nome: 'Monte Serrat',
    categoria: 'Turismo',
    bairro: 'Centro',
    descricao:
      'Mirante com vista panorâmica da cidade, acessível por funicular ou trilha.',
    descricaoCompleta:
      'No topo, o Santuário de Nossa Senhora do Monte Serrat e a melhor vista de Santos. Suba de funicular; lá em cima há mirante e capela centenária.',
    endereco: 'Praça Correia de Mello, 33, Centro, Santos - SP',
    imagem: img('monte-serrat.jpg'),
    imagemRemota: wiki('Monte_Serrat_pic03.JPG'),
    lat: -23.9333,
    lon: -46.3220,
    tipoApoio: ['turismo', 'mirante', 'família'],
    recomendadoParaBike: false,
    destaque: true,
    nivelRecomendacao: 'Ponto turístico',
    sugestaoBike: 'Deixe a bike na base e suba de funicular pela vista.',
    rotas: [ROTA_CENTRO],
  },
  {
    id: 'bolsa-oficial-cafe',
    nome: 'Bolsa Oficial de Café',
    categoria: 'Cultura',
    bairro: 'Centro',
    descricao:
      'Prédio histórico do auge cafeeiro, hoje integrado ao Museu do Café.',
    endereco: 'Rua XV de Novembro, 95, Centro, Santos - SP',
    imagem: img('bolsa-oficial-cafe.jpg'),
    imagemRemota: wiki('O_Principal.JPG'),
    lat: -23.9330,
    lon: -46.3286,
    tipoApoio: ['cultura', 'história', 'turismo'],
    recomendadoParaBike: true,
    destaque: false,
    nivelRecomendacao: 'Ponto turístico',
    rotas: [ROTA_CENTRO],
  },
  {
    id: 'museu-pele',
    nome: 'Museu Pelé',
    categoria: 'Cultura',
    bairro: 'Valongo',
    descricao:
      'Homenagem ao Rei do Futebol em casarão restaurado do Centro Histórico.',
    descricaoCompleta:
      'Acervo com troféus, fotos e a trajetória de Pelé. Visita imperdível para fãs de futebol que exploram o Valongo.',
    endereco: 'Largo Marquês de Monte Alegre, 1, Valongo, Santos - SP',
    imagem: img('museu-pele.jpg'),
    imagemRemota: wiki('Museupele.jpg'),
    lat: -23.9318,
    lon: -46.3300,
    tipoApoio: ['cultura', 'turismo', 'futebol'],
    recomendadoParaBike: true,
    destaque: true,
    nivelRecomendacao: 'Ponto turístico',
    rotas: [ROTA_CENTRO],
  },
  {
    id: 'pinacoteca-benedicto-calixto',
    nome: 'Pinacoteca Benedicto Calixto',
    categoria: 'Cultura',
    bairro: 'José Menino',
    descricao:
      'Galeria de arte em casarão histórico com obras do pintor santista.',
    endereco: 'Av. Bartolomeu de Gusmão, 15, José Menino, Santos - SP',
    imagem: img('pinacoteca-benedicto-calixto.jpg'),
    imagemRemota: wiki('Pinacoteca_Benedicto_Calixto.jpg'),
    lat: -23.9672,
    lon: -46.3368,
    tipoApoio: ['cultura', 'arte', 'parada leve'],
    recomendadoParaBike: true,
    destaque: false,
    nivelRecomendacao: 'Ponto turístico',
    sugestaoBike: 'Fica colada na orla, ótima parada cultural na Rota Orla.',
    rotas: [ROTA_ORLA],
  },
  {
    id: 'vila-belmiro',
    nome: 'Memorial das Conquistas / Vila Belmiro',
    categoria: 'Cultura',
    bairro: 'Vila Belmiro',
    descricao:
      'Estádio histórico do Santos FC com memorial de troféus e tour guiado.',
    descricaoCompleta:
      'O Estádio Urbano Caldeira (Vila Belmiro) abriga o Memorial das Conquistas, com taças e a história do clube de Pelé. Tour aberto a visitantes.',
    endereco: 'Rua Princesa Isabel, 77, Vila Belmiro, Santos - SP',
    imagem: img('vila-belmiro.jpg'),
    imagemRemota: wiki('Vila-Belmiro.webp'),
    lat: -23.9511,
    lon: -46.3382,
    tipoApoio: ['cultura', 'turismo', 'futebol', 'família'],
    recomendadoParaBike: false,
    destaque: true,
    nivelRecomendacao: 'Ponto turístico',
    rotas: [],
  },
  {
    id: 'mercado-de-peixe',
    nome: 'Mercado de Peixe de Santos',
    categoria: 'Alimentação',
    bairro: 'Ponta da Praia',
    descricao:
      'Peixes e frutos do mar fresquinhos, com restaurantes próximos ao cais.',
    endereco: 'Av. Bartolomeu de Gusmão, Ponta da Praia, Santos - SP',
    imagem: img('mercado-de-peixe.jpg'),
    imagemRemota: wiki('Deck_dos_Pescadores_da_Ponta_da_Praia_-_panoramio.jpg'),
    lat: -23.9862,
    lon: -46.3025,
    tipoApoio: ['alimentação', 'compras', 'parada rápida'],
    recomendadoParaBike: true,
    destaque: false,
    nivelRecomendacao: 'Ponto de alimentação',
    rotas: [ROTA_ORLA],
  },

  // ----------------------------- ORLA, PRAIA E BIKE -----------------------------
  {
    id: 'jardim-da-orla',
    nome: 'Jardim da Orla de Santos',
    categoria: 'Praia e Orla',
    bairro: 'Orla',
    descricao:
      'O maior jardim frontal de praia do mundo, símbolo da cidade e ótimo para pedalar.',
    descricaoCompleta:
      'Registrado no Guinness como o maior jardim de orla do planeta, acompanha toda a praia com canteiros floridos, ciclovia e calçadão. Cenário perfeito para o passeio de bike.',
    endereco: 'Av. Bartolomeu de Gusmão / Av. Pres. Wilson, Orla, Santos - SP',
    imagem: img('jardim-da-orla.jpg'),
    imagemRemota: wiki('Jardins_da_Orla_de_Santos_e_sua_ciclovia.jpg'),
    lat: -23.9750,
    lon: -46.3250,
    tipoApoio: ['praia', 'bom para bike', 'família', 'parada leve'],
    recomendadoParaBike: true,
    destaque: true,
    nivelRecomendacao: 'Ponto turístico',
    sugestaoBike: 'Espinha dorsal da Rota Orla — pedale lado a lado com o mar.',
    rotas: [ROTA_ORLA],
  },
  {
    id: 'quebra-mar',
    nome: 'Quebra-Mar',
    categoria: 'Praia e Orla',
    bairro: 'Ponta da Praia',
    descricao:
      'Molhe de pedras avançando no mar, point de pôr do sol e pesca.',
    endereco: 'Ponta da Praia, Santos - SP',
    imagem: img('quebra-mar.jpg'),
    imagemRemota: wiki('Ponta_da_Praia_-_panoramio.jpg'),
    lat: -23.9875,
    lon: -46.2990,
    tipoApoio: ['praia', 'bom para bike', 'foto', 'parada leve'],
    recomendadoParaBike: true,
    destaque: false,
    nivelRecomendacao: 'Ponto de descanso',
    sugestaoBike: 'Descanso final da Rota Orla com vista do canal do porto.',
    rotas: [ROTA_ORLA],
  },
  {
    id: 'ciclovia-da-orla',
    nome: 'Ciclovia da Orla',
    categoria: 'Apoio ao Ciclista',
    bairro: 'Orla',
    descricao:
      'Ciclovia plana que percorre toda a orla, ligando José Menino à Ponta da Praia.',
    endereco: 'Av. Pres. Wilson, ao longo da orla, Santos - SP',
    imagem: img('ciclovia-da-orla.jpg'),
    imagemRemota: wiki('Jardins_da_Orla_de_Santos_e_sua_ciclovia.jpg'),
    lat: -23.9760,
    lon: -46.3240,
    tipoApoio: ['bom para bike', 'apoio ao ciclista', 'parada leve'],
    recomendadoParaBike: true,
    destaque: true,
    nivelRecomendacao: 'Parada rápida',
    sugestaoBike: 'Via segura e plana que conecta quase todos os pontos da orla.',
    rotas: [ROTA_ORLA],
  },
  {
    id: 'ponta-da-praia',
    nome: 'Ponta da Praia',
    categoria: 'Praia e Orla',
    bairro: 'Ponta da Praia',
    descricao:
      'Extremo da orla com vista do porto, balsas, Aquário e Quebra-Mar.',
    endereco: 'Ponta da Praia, Santos - SP',
    imagem: img('ponta-da-praia.jpg'),
    imagemRemota: wiki('Santos_Ponta_da_Praia.JPG'),
    lat: -23.9893,
    lon: -46.3008,
    tipoApoio: ['praia', 'bom para bike', 'família', 'parada leve'],
    recomendadoParaBike: true,
    destaque: false,
    nivelRecomendacao: 'Ponto de descanso',
    rotas: [ROTA_ORLA],
  },

  // ----------------------------- ALIMENTAÇÃO -----------------------------
  {
    id: 'restaurantes-ponta-praia',
    nome: 'Restaurantes da Ponta da Praia',
    categoria: 'Alimentação',
    bairro: 'Ponta da Praia',
    descricao:
      'Polo de frutos do mar e restaurantes com vista para o canal do porto.',
    endereco: 'Av. Bartolomeu de Gusmão, Ponta da Praia, Santos - SP',
    imagem: img('restaurantes-ponta-praia.jpg'),
    imagemRemota: wiki('Vista_da_Ponta_da_Praia.jpg'),
    lat: -23.9868,
    lon: -46.3020,
    tipoApoio: ['alimentação', 'parada leve', 'família'],
    recomendadoParaBike: true,
    destaque: false,
    nivelRecomendacao: 'Ponto de alimentação',
    rotas: [ROTA_ORLA],
  },

  // ----------------------------- SHOPPINGS E COMPRAS -----------------------------
  {
    id: 'praiamar-shopping',
    nome: 'Praiamar Shopping',
    categoria: 'Compras',
    bairro: 'Aparecida',
    descricao:
      'Shopping à beira-mar com lojas, cinema e ampla praça de alimentação.',
    endereco: 'Av. Dr. Epitácio Pessoa, 470, Aparecida, Santos - SP',
    imagem: img('praiamar-shopping.jpg'),
    lat: -23.9836,
    lon: -46.3090,
    tipoApoio: ['compras', 'alimentação', 'família', 'parada leve'],
    recomendadoParaBike: true,
    destaque: true,
    nivelRecomendacao: 'Ponto de compras',
    sugestaoBike: 'Frente à orla: bom ponto de apoio, banheiro e ar-condicionado.',
    rotas: [ROTA_ORLA, ROTA_GONZAGA],
  },
]

// Filtros exibidos na interface. "Todos", "Família" e "Destaques" são
// derivados (tags/flag); os demais batem com a categoria do ponto.
export const filtrosPontos = [
  'Todos',
  'Turismo',
  'Praia e Orla',
  'Compras',
  'Alimentação',
  'Apoio ao Ciclista',
  'Cultura',
  'Família',
  'Destaques',
] as const

export type FiltroPonto = (typeof filtrosPontos)[number]

export function filtrarPontos(
  pontos: PontoSantos[],
  filtro: FiltroPonto,
  busca: string,
): PontoSantos[] {
  const termo = busca.trim().toLowerCase()

  return pontos.filter((ponto) => {
    const passaFiltro =
      filtro === 'Todos'
        ? true
        : filtro === 'Destaques'
          ? ponto.destaque
          : filtro === 'Família'
            ? ponto.tipoApoio.includes('família')
            : ponto.categoria === filtro

    if (!passaFiltro) {
      return false
    }

    if (!termo) {
      return true
    }

    return (
      ponto.nome.toLowerCase().includes(termo) ||
      ponto.bairro.toLowerCase().includes(termo) ||
      ponto.categoria.toLowerCase().includes(termo) ||
      ponto.tipoApoio.some((tag) => tag.includes(termo))
    )
  })
}
