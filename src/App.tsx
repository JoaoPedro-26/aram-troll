import { useMemo, useState } from 'react'
import { CardDetail, CardDetailPlaceholder } from './components/GameCard'
import { CardRoulette } from './components/CardRoulette'
import { cards } from './data/cards'
import { getCardById } from './utils/card'

function App() {
  const [revealedId, setRevealedId] = useState<string | null>(null)
  const [effectOverrides, setEffectOverrides] = useState<Record<string, string>>({})

  const revealedCard = useMemo(
    () => (revealedId ? getCardById(cards, revealedId) : null),
    [revealedId],
  )

  const effectOverride = revealedId ? effectOverrides[revealedId] ?? null : null

  const handleReveal = (card: (typeof cards)[number] | null) => {
    setRevealedId(card?.id ?? null)
  }

  const handleEffectGenerated = (cardId: string, effect: string | null) => {
    setEffectOverrides((current) => {
      if (!effect) {
        const next = { ...current }
        delete next[cardId]
        return next
      }
      return { ...current, [cardId]: effect }
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="text-center pt-14 pb-10 px-4">
        <h1 className="font-display text-3xl sm:text-4xl text-lol-gold tracking-wide">Biri LoL</h1>
        <p className="text-lol-gold-light/60 text-sm mt-3">
          Cartas ARAM — gire a roleta e descubra sua carta na Howling Abyss
        </p>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pb-12 flex flex-col gap-10">
        <section className="pt-2">
          <h2 className="font-display text-xs uppercase tracking-widest text-lol-gold/70 mb-8 text-center">
            Roleta de cartas
          </h2>
          <CardRoulette
            cards={cards}
            revealedId={revealedId}
            onReveal={handleReveal}
          />
        </section>

        <section>
          {revealedCard ? (
            <CardDetail
              card={revealedCard}
              effectOverride={effectOverride}
              onEffectGenerated={handleEffectGenerated}
            />
          ) : (
            <CardDetailPlaceholder />
          )}
        </section>
      </main>

      <footer className="text-center pb-6 text-xs text-lol-gold-light/30">
        Projeto de diversão — não afiliado à Riot Games
      </footer>
    </div>
  )
}

export default App
