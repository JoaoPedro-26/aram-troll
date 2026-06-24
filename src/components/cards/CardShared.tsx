import type { CardVariant } from '../../types/card'

interface CardVariantBadgeProps {
  variant: CardVariant
  size?: 'sm' | 'md'
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[9px]',
  md: 'px-3 py-0.5 text-[10px]',
} as const

export function CardVariantBadge({ variant, size = 'sm' }: CardVariantBadgeProps) {
  if (variant === 'troll') {
    return (
      <span
        className={`troll-badge mx-auto mb-1 shrink-0 whitespace-nowrap rounded-full bg-lime-500 font-bold uppercase tracking-wider text-lol-blue shadow-[0_0_14px_rgba(132,204,22,0.7)] ${sizeClasses[size]}`}
      >
        Troll
      </span>
    )
  }

  if (variant === 'gold') {
    return (
      <span
        className={`gold-badge mx-auto mb-1 shrink-0 whitespace-nowrap rounded-full bg-lol-accent font-bold uppercase tracking-wider text-lol-gold-light shadow-[0_0_12px_rgba(200,170,110,0.5)] ${sizeClasses[size]}`}
      >
        Gold
      </span>
    )
  }

  return null
}

interface CardPhotoProps {
  src: string
  alt: string
  borderClassName: string
  showGlitch?: boolean
  wiggle?: boolean
}

export function CardPhoto({ src, alt, borderClassName, showGlitch = false, wiggle = false }: CardPhotoProps) {
  return (
    <div className={`card-photo-frame relative min-h-0 flex-1 overflow-hidden rounded-lg border ${borderClassName}`}>
      {showGlitch && <div className="troll-glitch pointer-events-none absolute inset-0 z-10" />}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-contain bg-lol-blue/80 ${wiggle ? 'troll-img-wiggle' : ''}`}
      />
    </div>
  )
}
