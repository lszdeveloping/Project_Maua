import { Bike, MapPin, MapPinned, Navigation, Star, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { PontoSantos } from '../data/pontosSantos'
import { PontoImagem } from './PontoImagem'

function googleMapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

function openStreetMapEmbedUrl(lat: number, lon: number, delta = 0.012) {
  const left = lon - delta
  const bottom = lat - delta
  const right = lon + delta
  const top = lat + delta

  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lon}`
}

// Modal de detalhes do ponto. Imagem grande, endereço, nível de
// recomendação para ciclistas e sugestão de uso na rota.
export function PontoDetalhesModal({
  ponto,
  onClose,
}: {
  ponto: PontoSantos | null
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ponto) {
      return
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Move o foco do navegador para o modal e garante que ele entre na viewport.
    const dialog = dialogRef.current
    dialog?.focus({ preventScroll: true })
    dialog?.scrollIntoView({ block: 'center' })

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [ponto, onClose])

  if (!ponto) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ponto.nome}
        tabIndex={-1}
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl outline-none"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-72">
          <PontoImagem
            src={ponto.imagemRemota ?? ponto.imagem}
            fallbackSrc={ponto.imagemRemota ? ponto.imagem : undefined}
            alt={ponto.nome}
            className="h-full w-full"
            showHint
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Voltar"
            className="absolute right-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-950/75 text-white transition hover:bg-stone-950"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent px-6 py-5">
            <div>
              <span className="inline-flex rounded-full bg-amber-300 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-stone-950">
                {ponto.categoria}
              </span>
              <h2 className="mt-3 font-['Sora'] text-3xl font-semibold text-white">
                {ponto.nome}
              </h2>
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-white/85">
                <MapPin className="h-4 w-4 text-amber-300" />
                {ponto.bairro}
              </p>
            </div>
            {ponto.destaque && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-2 text-sm font-semibold text-white backdrop-blur">
                <Star className="h-4 w-4 fill-current text-amber-300" />
                Destaque
              </span>
            )}
          </div>
        </div>

        <div className="space-y-6 p-6 lg:p-8">
          <p className="text-base leading-7 text-stone-700">
            {ponto.descricaoCompleta ?? ponto.descricao}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.4rem] bg-stone-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                Endereço
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-700">{ponto.endereco}</p>
            </div>
            <div className="rounded-[1.4rem] bg-[#fff7e8] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
                Recomendação ao ciclista
              </p>
              <p className="mt-2 inline-flex items-center gap-2 text-base font-semibold text-stone-800">
                <Bike className="h-5 w-5 text-amber-700" />
                {ponto.nivelRecomendacao}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Localização no mapa
            </p>
            <div className="mt-3 overflow-hidden rounded-[1.4rem] border border-stone-200">
              <iframe
                title={`Mapa de ${ponto.nome}`}
                src={openStreetMapEmbedUrl(ponto.lat, ponto.lon)}
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {ponto.sugestaoBike && (
            <div className="rounded-[1.4rem] border border-teal-100 bg-teal-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
                Sugestão na rota de bike
              </p>
              <p className="mt-2 text-sm leading-6 text-teal-900">{ponto.sugestaoBike}</p>
            </div>
          )}

          {ponto.rotas.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                Aparece nas rotas
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ponto.rotas.map((rota) => (
                  <span
                    key={rota}
                    className="inline-flex items-center gap-1 rounded-full bg-teal-950 px-4 py-2 text-sm font-semibold text-white"
                  >
                    <Navigation className="h-4 w-4 text-amber-300" />
                    {rota}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Tags
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ponto.tipoApoio.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium capitalize text-stone-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-stone-200 pt-6">
            <a
              href={googleMapsSearchUrl(`${ponto.nome}, ${ponto.endereco}`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
            >
              <MapPinned className="h-4 w-4" />
              Abrir no Google Maps
            </a>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
