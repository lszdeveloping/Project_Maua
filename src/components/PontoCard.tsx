import { Bike, ChevronRight, MapPin, Star } from 'lucide-react'
import type { PontoSantos } from '../data/pontosSantos'
import { PontoImagem } from './PontoImagem'

// Card de um ponto estratégico. Visual grande e legível para totem touch.
export function PontoCard({
  ponto,
  onVerDetalhes,
  onVerRota,
}: {
  ponto: PontoSantos
  onVerDetalhes: (ponto: PontoSantos) => void
  onVerRota?: (ponto: PontoSantos) => void
}) {
  const temRota = ponto.rotas.length > 0
  const tagsVisiveis = ponto.tipoApoio.slice(0, 3)

  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.8rem] border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-44">
        <PontoImagem
          src={ponto.imagemRemota ?? ponto.imagem}
          fallbackSrc={ponto.imagemRemota ? ponto.imagem : undefined}
          alt={ponto.nome}
          className="h-full w-full"
        />
        {ponto.destaque && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-300 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-stone-950 shadow">
            <Star className="h-3.5 w-3.5 fill-current" />
            Destaque
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-['Sora'] text-xl font-semibold leading-tight text-stone-900">
            {ponto.nome}
          </h3>
          <span className="shrink-0 rounded-full bg-teal-950 px-3 py-1 text-[11px] font-semibold text-white">
            {ponto.categoria}
          </span>
        </div>

        <p className="mt-2 inline-flex items-center gap-1 text-sm text-stone-500">
          <MapPin className="h-4 w-4 text-teal-700" />
          {ponto.bairro}
        </p>

        <p className="mt-3 text-sm leading-6 text-stone-600">{ponto.descricao}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {tagsVisiveis.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium capitalize text-stone-600"
            >
              {tag}
            </span>
          ))}
          {ponto.recomendadoParaBike && (
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              <Bike className="h-3.5 w-3.5" />
              Bom para bike
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={() => onVerDetalhes(ponto)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
          >
            Ver detalhes
            <ChevronRight className="h-4 w-4" />
          </button>
          {temRota && onVerRota && (
            <button
              type="button"
              onClick={() => onVerRota(ponto)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-900 px-5 py-3 text-sm font-semibold text-teal-900 transition hover:bg-teal-950 hover:text-white"
            >
              <Bike className="h-4 w-4" />
              Ver rota próxima
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
