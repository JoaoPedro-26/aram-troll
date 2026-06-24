import type { CardVariant } from '../types/card'

interface WinnerSlotState {
  variant: CardVariant
  isWinner: boolean
  isSpinning: boolean
}

export function getWinnerSlotClassName({ variant, isWinner, isSpinning }: WinnerSlotState): string {
  if (!isWinner) return 'roulette-card-slot shrink-0 transition-transform duration-500'

  const classes = ['roulette-card-slot', 'shrink-0', 'transition-transform', 'duration-500', 'z-10']

  if (variant === 'troll') {
    classes.push('troll-winner-slot', 'gold-winner-slot', 'z-20')
    if (!isSpinning) classes.push('troll-roulette-winner')
    return classes.join(' ')
  }

  if (variant === 'gold') {
    classes.push('gold-winner-slot')
    if (!isSpinning) classes.push('gold-roulette-winner', 'roulette-winner')
    return classes.join(' ')
  }

  if (!isSpinning) classes.push('roulette-winner')
  return classes.join(' ')
}

export function getFaceHighlightClassName(variant: CardVariant, highlighted: boolean): string {
  if (!highlighted) return ''

  if (variant === 'troll') return 'troll-card-highlight ring-2 ring-lime-400/80 ring-inset'
  if (variant === 'gold') return 'gold-card-highlight ring-2 ring-lol-gold/80 ring-inset'
  return 'ring-2 ring-zinc-400/80 ring-inset'
}

export function getPhotoBorderClassName(variant: CardVariant): string {
  if (variant === 'troll') return 'border-lime-400/50 troll-image-glow'
  if (variant === 'gold') return 'border-lol-gold/50 gold-image-glow'
  return 'border-zinc-500/40'
}

export function getDetailPhotoBorderClassName(variant: CardVariant): string {
  if (variant === 'troll') return 'border-lime-400/60 troll-image-glow'
  if (variant === 'gold') return 'border-lol-gold/60 gold-image-glow'
  return 'border-zinc-500/50'
}

export function getTitleClassName(variant: CardVariant): string {
  if (variant === 'troll') return 'text-lime-300 troll-text-glow'
  if (variant === 'gold') return 'text-lol-gold gold-text-glow'
  return 'text-zinc-200'
}

export function getFaceTitleClassName(variant: CardVariant): string {
  if (variant === 'troll') return 'text-lime-300 troll-text-glow'
  if (variant === 'gold') return 'text-lol-gold'
  return 'text-zinc-300'
}

export function getQuoteBorderClassName(variant: CardVariant): string {
  if (variant === 'troll') return 'border-lime-400/50'
  if (variant === 'gold') return 'border-lol-gold/50'
  return 'border-zinc-500/50'
}

export function getEffectBoxClassName(variant: CardVariant): string {
  if (variant === 'troll') return 'bg-lime-950/20 border-lime-400/30'
  if (variant === 'gold') return 'bg-amber-950/20 border-lol-gold/30'
  return 'bg-lol-blue/60 border-zinc-500/30'
}

export function getEffectHeadingClassName(variant: CardVariant): string {
  if (variant === 'troll') return 'text-lime-300'
  if (variant === 'gold') return 'text-lol-gold'
  return 'text-zinc-400'
}

export function getDetailBadgeClassName(variant: CardVariant): string {
  if (variant === 'troll') return 'bg-lime-950 text-lime-300 border-lime-400/50'
  if (variant === 'gold') return 'bg-amber-950 text-lol-gold border-lol-gold/50'
  return 'bg-lol-blue text-zinc-300 border-zinc-500/50'
}

export function getDetailContainerClassName(variant: CardVariant): string {
  if (variant === 'troll') return 'troll-card-detail'
  if (variant === 'gold') return 'gold-card-detail'
  return ''
}
