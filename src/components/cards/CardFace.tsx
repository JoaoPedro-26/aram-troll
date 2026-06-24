import { RARITY_STYLES } from '../../constants/cardTheme'
import type { GameCard } from '../../types/card'
import { getCardVariant } from '../../utils/card'
import { getFaceHighlightClassName, getFaceTitleClassName, getPhotoBorderClassName } from '../../utils/cardStyles'
import { CardPhoto, CardVariantBadge } from './CardShared'

interface CardFaceProps {
  card: GameCard
  highlighted?: boolean
}

export function CardFace({ card, highlighted = false }: CardFaceProps) {
  const variant = getCardVariant(card)

  return (
    <div
      className={`
        relative flex h-full min-h-0 flex-col rounded-xl border-2 bg-linear-to-b p-2 sm:p-2.5 roulette-reveal
        ${RARITY_STYLES[card.rarity]}
        ${getFaceHighlightClassName(variant, highlighted)}
      `}
    >
      {(variant === 'gold' || variant === 'troll') && <CardVariantBadge variant={variant} />}

      <CardPhoto
        src={card.playerAvatar}
        alt={card.playerName}
        borderClassName={getPhotoBorderClassName(variant)}
        showGlitch={variant === 'troll' && highlighted}
        wiggle={variant === 'troll' && highlighted}
      />

      <div className="mt-1.5 shrink-0 pb-0.5">
        <p className={`font-display text-[11px] sm:text-xs truncate leading-tight ${getFaceTitleClassName(variant)}`}>
          {card.name}
        </p>
        <p className="text-[9px] sm:text-[10px] text-lol-gold-light/60 truncate leading-tight">{card.playerName}</p>
      </div>
    </div>
  )
}
