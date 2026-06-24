import type { CardRarity, CardVariant } from '../types/card'

export const RARITY_STYLES: Record<CardRarity, string> = {
  comum: 'border-zinc-500/60 from-zinc-800/80 to-zinc-900/90',
  gold: 'border-lol-gold/80 from-amber-900/50 to-zinc-900/90 shadow-[0_0_20px_rgba(200,170,110,0.3)]',
}

export const RARITY_LABELS: Record<CardRarity, string> = {
  comum: 'Comum',
  gold: 'Gold',
}

export const VARIANT_BADGE_LABELS: Record<CardVariant, string> = {
  comum: 'Comum',
  gold: 'Gold',
  troll: 'Troll',
}
