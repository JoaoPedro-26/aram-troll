import type { CardVariant, GameCard } from '../types/card'

export function isBiriCard(card: GameCard): boolean {
  return card.id.startsWith('biri-')
}

export function getCardVariant(card: GameCard): CardVariant {
  if (isBiriCard(card)) return 'troll'
  if (card.rarity === 'gold') return 'gold'
  return 'comum'
}

export function getCardById(cards: GameCard[], id: string): GameCard | null {
  return cards.find((card) => card.id === id) ?? null
}
