interface CardBackProps {
  dimmed?: boolean
}

export function CardBack({ dimmed = false }: CardBackProps) {
  return (
    <div
      className={`
        flex h-full min-h-0 flex-col rounded-xl border-2 border-lol-gold/30 bg-linear-to-br from-lol-blue-light to-lol-blue p-2.5 sm:p-3
        transition-opacity duration-300
        ${dimmed ? 'opacity-80' : 'opacity-100'}
      `}
    >
      <div className="card-back-pattern relative min-h-0 flex-1 overflow-hidden rounded-lg border border-lol-gold/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border-2 border-lol-gold/40 bg-lol-blue/80">
            <span className="font-display text-2xl sm:text-3xl text-lol-gold/60">?</span>
          </div>
        </div>
      </div>
      <div className="mt-2 shrink-0 text-center">
        <p className="font-display text-xs text-lol-gold/30 tracking-wider">???</p>
        <p className="text-[10px] text-lol-gold-light/20">Carta oculta</p>
      </div>
    </div>
  )
}
