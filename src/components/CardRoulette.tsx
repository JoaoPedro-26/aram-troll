import { useCardRoulette } from '../hooks/useCardRoulette'
import type { GameCard } from '../types/card'
import { RouletteTrack, SpinButton } from './roulette/RouletteParts'

interface CardRouletteProps {
  cards: GameCard[]
  onReveal: (card: GameCard | null) => void
  revealedId: string | null
}

export function CardRoulette({ cards, onReveal, revealedId }: CardRouletteProps) {
  const {
    viewportRef,
    trackRef,
    extendedCards,
    offset,
    transitionEnabled,
    isSpinning,
    layoutReady,
    winningKey,
    spin,
    handleTransitionEnd,
  } = useCardRoulette({ cards, onReveal })

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-full max-w-5xl mx-auto pt-8">
        <div className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2">
          <div className="h-0 w-0 border-x-12 border-t-16 border-x-transparent border-t-lol-gold drop-shadow-[0_0_8px_rgba(200,170,110,0.7)]" />
        </div>

        <div ref={viewportRef} className="roulette-viewport relative h-120 overflow-hidden sm:h-136">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-lol-blue to-transparent sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-lol-blue to-transparent sm:w-20" />

          <RouletteTrack
            trackRef={trackRef}
            offset={offset}
            transitionEnabled={transitionEnabled}
            isSpinning={isSpinning}
            isRevealed={revealedId !== null}
            winningKey={winningKey}
            cards={extendedCards}
            onTransitionEnd={handleTransitionEnd}
          />
        </div>

        <div className="pointer-events-none absolute -bottom-1 left-1/2 z-20 -translate-x-1/2">
          <div className="h-2.5 w-2.5 rotate-45 bg-lol-gold shadow-[0_0_10px_rgba(200,170,110,0.9)]" />
        </div>
      </div>

      <SpinButton
        isSpinning={isSpinning}
        layoutReady={layoutReady}
        hasRevealedCard={revealedId !== null}
        onSpin={spin}
      />
    </div>
  )
}
