import { ImageOff, MapPinned } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

// Imagem com fallback elegante. Nunca mostra imagem quebrada:
// tenta cada candidato em ordem (remota → local) e, se todos falharem,
// exibe um placeholder com gradiente.
export function PontoImagem({
  src,
  fallbackSrc,
  alt,
  className = '',
  showHint = false,
}: {
  src: string
  fallbackSrc?: string
  alt: string
  className?: string
  showHint?: boolean
}) {
  const candidatos = useMemo(
    () => [src, fallbackSrc].filter((value): value is string => Boolean(value)),
    [src, fallbackSrc],
  )
  const [indice, setIndice] = useState(0)

  useEffect(() => {
    setIndice(0)
  }, [candidatos])

  const atual = candidatos[indice]
  const hint = fallbackSrc ?? src

  if (!atual) {
    return (
      <div
        className={`flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_40%),linear-gradient(160deg,_#0f3d4c_0%,_#145a6b_55%,_#efb447_100%)] p-4 text-center text-white ${className}`}
      >
        <div>
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <ImageOff className="h-6 w-6 text-amber-300" />
          </span>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/90">
            Imagem do local
          </p>
          {showHint && (
            <p className="mx-auto mt-2 max-w-[16rem] text-[11px] leading-5 text-white/70">
              Adicione o arquivo em
              <br />
              <code className="text-amber-200">{hint}</code>
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        key={atual}
        src={atual}
        alt={alt}
        loading="lazy"
        onError={() => setIndice((i) => i + 1)}
        className="h-full w-full object-cover"
      />
      <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-stone-950/70 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
        <MapPinned className="h-3.5 w-3.5 text-amber-300" />
        Santos
      </span>
    </div>
  )
}
