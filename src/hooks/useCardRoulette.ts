import { useCallback, useEffect, useMemo, useRef, useState, type TransitionEvent } from 'react'
import { ROULETTE_SPIN_DURATION_MS } from '../constants/roulette'
import {
  buildExtendedDeck,
  createSlotKey,
  createSpinPlan,
  getDeckStartIndex,
  getOffsetForIndex,
  measureRouletteMetrics,
} from '../lib/roulette'
import type { GameCard } from '../types/card'

interface UseCardRouletteOptions {
  cards: GameCard[]
  onReveal: (card: GameCard | null) => void
}

export function useCardRoulette({ cards, onReveal }: UseCardRouletteOptions) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const spinLockRef = useRef(false)
  const centerIndexRef = useRef(0)
  const pendingTargetRef = useRef<number | null>(null)

  const [isSpinning, setIsSpinning] = useState(false)
  const [offset, setOffset] = useState(0)
  const [transitionEnabled, setTransitionEnabled] = useState(false)
  const [winningKey, setWinningKey] = useState<string | null>(null)
  const [layoutReady, setLayoutReady] = useState(false)

  const extendedCards = useMemo(() => buildExtendedDeck(cards), [cards])
  const startIndex = useMemo(() => getDeckStartIndex(cards.length), [cards.length])

  const readMetrics = useCallback(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return null
    return measureRouletteMetrics(viewport, track)
  }, [])

  const snapToIndex = useCallback(
    (index: number, animate: boolean) => {
      const metrics = readMetrics()
      if (!metrics) return false

      centerIndexRef.current = index
      setTransitionEnabled(animate)
      setOffset(getOffsetForIndex(index, metrics))
      return true
    },
    [readMetrics],
  )

  const finishSpin = useCallback(
    (targetIndex: number) => {
      if (pendingTargetRef.current !== targetIndex) return
      pendingTargetRef.current = null

      centerIndexRef.current = targetIndex

      const metrics = readMetrics()
      if (metrics) {
        setTransitionEnabled(false)
        setOffset(getOffsetForIndex(targetIndex, metrics))
      }

      const winnerCard = extendedCards[targetIndex]
      setWinningKey(createSlotKey(winnerCard.id, targetIndex))
      onReveal(winnerCard)
      setIsSpinning(false)

      requestAnimationFrame(() => {
        spinLockRef.current = false
      })
    },
    [extendedCards, onReveal, readMetrics],
  )

  const initLayout = useCallback(() => {
    if (cards.length === 0) return
    const isReady = snapToIndex(startIndex, false)
    if (isReady) setLayoutReady(true)
  }, [cards.length, snapToIndex, startIndex])

  useEffect(() => {
    initLayout()

    const viewport = viewportRef.current
    if (!viewport) return

    const observer = new ResizeObserver(() => {
      if (spinLockRef.current) return
      snapToIndex(centerIndexRef.current, false)
    })

    observer.observe(viewport)
    return () => observer.disconnect()
  }, [initLayout, snapToIndex])

  const handleTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.propertyName !== 'transform') return
      if (pendingTargetRef.current === null) return
      finishSpin(pendingTargetRef.current)
    },
    [finishSpin],
  )

  const spin = useCallback(() => {
    if (spinLockRef.current || isSpinning || cards.length === 0 || !layoutReady) return

    const metrics = readMetrics()
    if (!metrics) return

    const plan = createSpinPlan(centerIndexRef.current, cards, extendedCards.length)
    if (!plan) return

    const { fromIndex, targetIndex } = plan

    spinLockRef.current = true
    pendingTargetRef.current = targetIndex
    setWinningKey(null)
    onReveal(null)
    setIsSpinning(true)
    setTransitionEnabled(false)
    setOffset(getOffsetForIndex(fromIndex, metrics))

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const freshMetrics = readMetrics()
        if (!freshMetrics) {
          spinLockRef.current = false
          pendingTargetRef.current = null
          setIsSpinning(false)
          return
        }

        setTransitionEnabled(true)
        setOffset(getOffsetForIndex(targetIndex, freshMetrics))
      })
    })

    window.setTimeout(() => {
      if (pendingTargetRef.current === null) return
      finishSpin(pendingTargetRef.current)
    }, ROULETTE_SPIN_DURATION_MS + 150)
  }, [cards, extendedCards.length, finishSpin, isSpinning, layoutReady, onReveal, readMetrics])

  return {
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
  }
}
