import type { GameCard } from '../types/card'
import { getCardVariant } from '../utils/card'

const METADATA_PREFIX = /^(carta|invocador|frase|tipo|efeito)\s*:/i

export function sanitizeGeneratedEffect(raw: string): string {
  let text = raw.trim().replace(/^["']|["']$/g, '')

  const efeitoMatch = text.match(/(?:^|\s)Efeito:\s*(.+)$/is)
  if (efeitoMatch?.[1]) {
    return efeitoMatch[1].trim().replace(/^["']|["']$/g, '')
  }

  const withoutMetadata = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line && !METADATA_PREFIX.test(line))
    .join(' ')
    .trim()

  if (withoutMetadata) return withoutMetadata

  return text
}

export function buildCardEffectPrompt(targetCard: GameCard, allCards: GameCard[]): string {
  const references = allCards
    .filter((card) => card.id !== targetCard.id)
    .map((card) => `- ${card.description}`)
    .join('\n')

  const variant = getCardVariant(targetCard)

  return `[Contexto interno — NÃO inclua na resposta]
Carta: ${targetCard.name}
Invocador: ${targetCard.playerName}
Frase: ${targetCard.catchphrase}
Tipo: ${variant}
Efeito atual: ${targetCard.description}

Exemplos de outros efeitos:
${references}

[Tarefa]
Invente um NOVO efeito para esta carta em ARAM entre amigos.

IMPORTANTE: sua resposta deve conter SOMENTE o texto do efeito (1 a 3 frases).
Não escreva "Carta:", "Invocador:", "Frase:", "Tipo:", "Efeito:" nem qualquer rótulo.
Não repita o nome da carta.

Exemplo de resposta correta:
Todos os jogadores têm que fazer coração de aço.

Exemplo de resposta errada:
Carta: Biri Jão Efeito: todos fazem heartsteel.`
}
