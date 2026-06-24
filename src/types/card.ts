export type CardRarity = 'comum' | 'gold'
export type CardVariant = 'comum' | 'gold' | 'troll'

export interface GameCard {
  id: string
  name: string
  playerName: string
  playerAvatar: string
  catchphrase: string
  description: string
  rarity: CardRarity
}
