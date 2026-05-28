import { Search } from 'lucide-react'
import { filtrosPontos, type FiltroPonto } from '../data/pontosSantos'

// Filtros por categoria + campo de busca por nome do local.
export function FiltroPontos({
  filtroAtivo,
  onFiltroChange,
  busca,
  onBuscaChange,
}: {
  filtroAtivo: FiltroPonto
  onFiltroChange: (filtro: FiltroPonto) => void
  busca: string
  onBuscaChange: (busca: string) => void
}) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={busca}
          onChange={(event) => onBuscaChange(event.target.value)}
          placeholder="Buscar ponto por nome ou bairro..."
          className="w-full rounded-full border border-stone-200 bg-white py-4 pl-12 pr-5 text-base text-stone-800 shadow-sm outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/30"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        {filtrosPontos.map((filtro) => {
          const ativo = filtro === filtroAtivo

          return (
            <button
              key={filtro}
              type="button"
              onClick={() => onFiltroChange(filtro)}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                ativo
                  ? 'bg-teal-950 text-white shadow-lg'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {filtro}
            </button>
          )
        })}
      </div>
    </div>
  )
}
