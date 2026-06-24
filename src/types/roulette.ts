export interface RouletteMetrics {
  cardWidth: number
  gap: number
  padding: number
  stride: number
  viewportWidth: number
}

export interface RouletteSpinPlan {
  fromIndex: number
  targetIndex: number
  winnerIndex: number
}
