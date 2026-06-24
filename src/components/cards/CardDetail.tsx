import { useEffect, useState } from 'react'
import { RARITY_STYLES, VARIANT_BADGE_LABELS } from '../../constants/cardTheme'
import type { GameCard } from '../../types/card'
import { getCardVariant } from '../../utils/card'
import {
  getDetailBadgeClassName,
  getDetailContainerClassName,
  getDetailPhotoBorderClassName,
  getEffectBoxClassName,
  getEffectHeadingClassName,
  getQuoteBorderClassName,
  getTitleClassName,
} from '../../utils/cardStyles'
import { BiriTerminal } from '../terminal/BiriTerminal'

interface CardDetailProps {
  card: GameCard
  effectOverride?: string | null
  onEffectGenerated: (cardId: string, effect: string | null) => void
}

function CardDetailBanner({ variant }: { variant: ReturnType<typeof getCardVariant> }) {
  if (variant === 'troll') {
    return (
      <>
        <div className="troll-shimmer pointer-events-none absolute inset-0" />
        <div className="relative mb-4 rounded-lg border border-lime-400/50 bg-lime-950/30 px-4 py-2 text-center">
          <p className="font-display text-sm uppercase tracking-[0.2em] text-lime-300 troll-text-glow">
            Carta Troll do Biri
          </p>
          <p className="mt-0.5 text-xs text-lime-200/70">Gold + caos garantido</p>
        </div>
      </>
    )
  }

  if (variant === 'gold') {
    return (
      <>
        <div className="gold-shimmer pointer-events-none absolute inset-0" />
        <div className="relative mb-4 rounded-lg border border-lol-gold/40 bg-amber-950/30 px-4 py-2 text-center">
          <p className="font-display text-sm uppercase tracking-[0.2em] text-lol-gold gold-text-glow">
            Carta Gold
          </p>
        </div>
      </>
    )
  }

  return null
}

export function CardDetail({ card, effectOverride, onEffectGenerated }: CardDetailProps) {
  const variant = getCardVariant(card)
  const effectText = effectOverride ?? card.description
  const isGenerated = Boolean(effectOverride)
  const [terminalOpen, setTerminalOpen] = useState(false)

  useEffect(() => {
    setTerminalOpen(false)
  }, [card.id])

  const toggleTerminal = () => {
    setTerminalOpen((open) => !open)
  }

  return (
    <div
      className={`
        relative rounded-2xl border-2 bg-linear-to-br p-6 sm:p-8 card-detail-reveal overflow-hidden
        ${getDetailContainerClassName(variant) || RARITY_STYLES[card.rarity]}
      `}
    >
      <CardDetailBanner variant={variant} />

      <div className="relative flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="relative shrink-0 w-full sm:w-auto">
          <div
            className={`mx-auto w-full max-w-64 sm:w-56 sm:max-w-none aspect-3/4 rounded-xl overflow-hidden border-2 shadow-lg ${getDetailPhotoBorderClassName(variant)}`}
          >
            {variant === 'troll' && <div className="troll-glitch pointer-events-none absolute inset-0 z-10" />}
            <img
              src={card.playerAvatar}
              alt={card.playerName}
              className={`h-full w-full object-contain bg-lol-blue/80 ${variant === 'troll' ? 'troll-img-wiggle' : ''}`}
            />
          </div>
          <span
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider border ${getDetailBadgeClassName(variant)}`}
          >
            {VARIANT_BADGE_LABELS[variant]}
          </span>
        </div>

        <div className="flex-1 text-center sm:text-left w-full">
          <h2 className={`font-display text-2xl sm:text-3xl mb-1 ${getTitleClassName(variant)}`}>{card.name}</h2>
          <p className="text-sm text-lol-gold-light/70 mb-4">
            Invocador: <span className="text-lol-gold-light font-medium">{card.playerName}</span>
          </p>

          <blockquote className={`border-l-2 pl-4 italic text-lol-gold-light/90 mb-4 ${getQuoteBorderClassName(variant)}`}>
            {card.catchphrase}
          </blockquote>

          <button
            type="button"
            onClick={toggleTerminal}
            className={`
              w-full rounded-lg p-4 border text-left transition-all
              ${getEffectBoxClassName(variant)}
              ${terminalOpen
                ? 'ring-2 ring-lime-400/50 shadow-[0_0_16px_rgba(132,204,22,0.15)]'
                : 'hover:brightness-110 cursor-pointer hover:shadow-[0_0_12px_rgba(132,204,22,0.1)]'
              }
            `}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className={`font-display text-xs uppercase tracking-widest ${getEffectHeadingClassName(variant)}`}>
                Efeito da Carta
              </h3>
              <span className="text-[9px] uppercase tracking-widest text-lime-400/60">
                {terminalOpen ? 'terminal aberto' : isGenerated ? 'via terminal · clique' : 'clique p/ trocar'}
              </span>
            </div>
            <p className="text-sm text-lol-gold-light/80 leading-relaxed">{effectText}</p>
            {!terminalOpen && (
              <p className="mt-2 text-[10px] text-lol-gold-light/40 italic">
                Não curtiu o efeito? Clique aqui para abrir o terminal e gerar outro.
              </p>
            )}
          </button>

          {terminalOpen && (
            <BiriTerminal
              card={card}
              onClose={() => setTerminalOpen(false)}
              onEffectGenerated={onEffectGenerated}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export function CardDetailPlaceholder() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-lol-gold/20 bg-lol-blue-light/20 p-10 sm:p-14 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-lol-gold/20 bg-lol-blue/60">
        <span className="font-display text-2xl text-lol-gold/30">?</span>
      </div>
      <p className="font-display text-sm uppercase tracking-widest text-lol-gold/50">Carta não revelada</p>
      <p className="mt-2 text-sm text-lol-gold-light/40">
        Gire a roleta para descobrir qual carta caiu pra você
      </p>
    </div>
  )
}
