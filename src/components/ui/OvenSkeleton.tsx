interface SkeletonCardProps {
  className?: string
}

export function OvenSkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div className={`pizza-skel-card aspect-[3/4] ${className}`}>
      {/* Área da imagem — círculo de pizza */}
      <div className="relative h-[55%] flex items-center justify-center p-6">
        <div className="w-full aspect-square rounded-full bg-stone-800/60" />
      </div>
      {/* Linhas de texto */}
      <div className="px-4 pb-5 space-y-2">
        <div className="h-3 rounded bg-stone-700/60 w-3/4" />
        <div className="h-2.5 rounded bg-stone-800/60 w-1/2" />
        <div className="h-2.5 rounded bg-stone-800/60 w-2/3 mt-1" />
        <div className="h-8 rounded-full bg-stone-700/50 w-full mt-3" />
      </div>
    </div>
  )
}

export function OvenSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <OvenSkeletonCard key={i} />
      ))}
    </div>
  )
}
