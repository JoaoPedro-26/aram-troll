import type { RefObject, TransitionEvent } from 'react'
import { ROULETTE_SPIN_DURATION_MS, ROULETTE_SPIN_EASING } from '../../constants/roulette'
import { createSlotKey } from '../../lib/roulette'
import type { GameCard } from '../../types/card'
import { getCardVariant } from '../../utils/card'
import { getWinnerSlotClassName } from '../../utils/cardStyles'
import { CardBack } from '../cards/CardBack'
import { CardFace } from '../cards/CardFace'

interface RouletteSlotProps {
  card: GameCard
  index: number
  isSpinning: boolean
  isRevealed: boolean
  winningKey: string | null
}

export function RouletteSlot({ card, index, isSpinning, isRevealed, winningKey }: RouletteSlotProps) {
  const slotKey = createSlotKey(card.id, index)
  const isWinner = winningKey === slotKey
  const variant = getCardVariant(card)

  return (
    <div data-card-slot className={getWinnerSlotClassName({ variant, isWinner, isSpinning })}>
      {isWinner && isRevealed ? <CardFace card={card} highlighted /> : <CardBack dimmed={isSpinning} />}
    </div>
  )
}

interface RouletteTrackProps {
  trackRef: RefObject<HTMLDivElement | null>
  offset: number
  transitionEnabled: boolean
  isSpinning: boolean
  isRevealed: boolean
  winningKey: string | null
  cards: GameCard[]
  onTransitionEnd: (event: TransitionEvent<HTMLDivElement>) => void
}

export function RouletteTrack({
  trackRef,
  offset,
  transitionEnabled,
  isSpinning,
  isRevealed,
  winningKey,
  cards,
  onTransitionEnd,
}: RouletteTrackProps) {
  return (
    <div
      ref={trackRef}
      className="flex h-full items-stretch gap-5 px-6 py-4"
      onTransitionEnd={onTransitionEnd}
      style={{
        transform: `translateX(${offset}px)`,
        transition: transitionEnabled
          ? `transform ${ROULETTE_SPIN_DURATION_MS}ms ${ROULETTE_SPIN_EASING}`
          : 'none',
        willChange: transitionEnabled ? 'transform' : 'auto',
      }}
    >
      {cards.map((card, index) => (
        <RouletteSlot
          key={createSlotKey(card.id, index)}
          card={card}
          index={index}
          isSpinning={isSpinning}
          isRevealed={isRevealed}
          winningKey={winningKey}
        />
      ))}
    </div>
  )
}

interface SpinButtonProps {
  isSpinning: boolean
  layoutReady: boolean
  hasRevealedCard: boolean
  onSpin: () => void
}

export function SpinButton({ isSpinning, layoutReady, hasRevealedCard, onSpin }: SpinButtonProps) {
  const isDisabled = isSpinning || !layoutReady
  const label = isSpinning ? 'Girando...' : hasRevealedCard ? 'Girar novamente' : 'Girar roleta'

  return (
    <button
      type="button"
      onClick={onSpin}
      disabled={isDisabled}
      className={`
        font-display relative overflow-hidden rounded-xl border-2 px-10 py-3 text-sm uppercase tracking-widest
        transition-all duration-300
        ${
          isDisabled
            ? 'border-lol-gold/30 bg-lol-blue-light/50 text-lol-gold/40 cursor-not-allowed'
            : 'border-lol-gold bg-linear-to-b from-lol-accent/80 to-lol-blue-light text-lol-gold-light hover:from-lol-gold/30 hover:shadow-[0_0_24px_rgba(200,170,110,0.25)] cursor-pointer active:scale-95'
        }
      `}
    >
      {label}
    </button>
  )
}
