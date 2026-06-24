import {
  ROULETTE_FALLBACK_GAP,
  ROULETTE_FALLBACK_PADDING,
  ROULETTE_LOOPS_MAX,
  ROULETTE_LOOPS_MIN,
  ROULETTE_REPEAT_COUNT,
} from '../constants/roulette'
import type { GameCard } from '../types/card'
import type { RouletteMetrics, RouletteSpinPlan } from '../types/roulette'

const CARD_SLOT_SELECTOR = '[data-card-slot]'

export function buildExtendedDeck(cards: GameCard[]): GameCard[] {
  return Array.from({ length: ROULETTE_REPEAT_COUNT }, () => cards).flat()
}

export function getDeckStartIndex(cardCount: number): number {
  return cardCount * Math.floor(ROULETTE_REPEAT_COUNT / 2)
}

export function createSlotKey(cardId: string, index: number): string {
  return `${cardId}-${index}`
}

export function measureRouletteMetrics(
  viewport: HTMLElement,
  track: HTMLElement,
): RouletteMetrics | null {
  const slot = track.querySelector<HTMLElement>(CARD_SLOT_SELECTOR)
  if (!slot) return null

  const cardWidth = slot.offsetWidth
  if (cardWidth <= 0) return null

  const trackStyles = getComputedStyle(track)
  const gap = parseFloat(trackStyles.gap) || ROULETTE_FALLBACK_GAP
  const padding = parseFloat(trackStyles.paddingLeft) || ROULETTE_FALLBACK_PADDING

  return {
    cardWidth,
    gap,
    padding,
    stride: cardWidth + gap,
    viewportWidth: viewport.clientWidth,
  }
}

export function getOffsetForIndex(index: number, metrics: RouletteMetrics): number {
  const cardCenter = metrics.padding + index * metrics.stride + metrics.cardWidth / 2
  return metrics.viewportWidth / 2 - cardCenter
}

function computeSlotsToAdvance(
  currentIndex: number,
  cardCount: number,
  winnerIndex: number,
  loops: number,
): number {
  const currentMod = ((currentIndex % cardCount) + cardCount) % cardCount
  let delta = winnerIndex - currentMod
  if (delta <= 0) delta += cardCount
  return loops * cardCount + delta
}

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}

export function createSpinPlan(
  centerIndex: number,
  cards: GameCard[],
  deckLength: number,
): RouletteSpinPlan | null {
  if (cards.length === 0) return null

  const winnerIndex = Math.floor(Math.random() * cards.length)
  const loops = randomInt(ROULETTE_LOOPS_MIN, ROULETTE_LOOPS_MAX)

  let fromIndex = centerIndex
  let slotsToAdvance = computeSlotsToAdvance(fromIndex, cards.length, winnerIndex, loops)
  let targetIndex = fromIndex + slotsToAdvance

  if (targetIndex >= deckLength) {
    fromIndex = getDeckStartIndex(cards.length)
    slotsToAdvance = computeSlotsToAdvance(fromIndex, cards.length, winnerIndex, loops)
    targetIndex = fromIndex + slotsToAdvance
  }

  if (targetIndex >= deckLength) return null

  return { fromIndex, targetIndex, winnerIndex }
}
