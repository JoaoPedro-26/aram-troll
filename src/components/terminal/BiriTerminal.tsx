import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { cards } from '../../data/cards'
import { buildCardEffectPrompt, sanitizeGeneratedEffect } from '../../lib/cardEffectPrompt'
import {
  destroyWebAiSession,
  getWebAiStatus,
  isWebAiSupported,
  promptWebAiStreaming,
  type WebAiSettings,
} from '../../lib/webAi'
import type { GameCard } from '../../types/card'
import { getCardById } from '../../utils/card'

type LineType = 'system' | 'input' | 'output' | 'error' | 'progress'

interface TerminalLine {
  id: number
  type: LineType
  text: string
}

interface BiriTerminalProps {
  card: GameCard
  onClose: () => void
  onEffectGenerated: (cardId: string, effect: string | null) => void
}

const COMMAND_HINTS = [
  { cmd: 'gerar', desc: 'novo efeito' },
  { cmd: 'temp 1', desc: 'criatividade' },
  { cmd: 'topk 3', desc: 'variação' },
  { cmd: 'original', desc: 'efeito padrão' },
  { cmd: 'limpar', desc: 'limpar tela' },
  { cmd: 'help', desc: 'todos os comandos' },
] as const

const HELP_TEXT = `Comandos:
  gerar             gera novo efeito desta carta
  temp <0-2>        criatividade (padrão: 1)
  topk <1-8>        variação / topK (padrão: 3)
  top <1-8>         atalho para topk
  original          restaura efeito original
  limpar            limpa o terminal
  fechar            fecha o terminal
  status            verifica Web AI
  help              esta lista

Requer Chrome + Web AI (Gemini Nano) em localhost.`

let lineCounter = 0

function findLastOutputIndex(items: TerminalLine[]): number {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (items[index].type === 'output') return index
  }
  return -1
}

function createLine(type: LineType, text: string): TerminalLine {
  lineCounter += 1
  return { id: lineCounter, type, text }
}

export function BiriTerminal({ card, onClose, onEffectGenerated }: BiriTerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    createLine('system', `Terminal aberto para "${card.name}". Digite "gerar" ou use os atalhos abaixo.`),
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [settings, setSettings] = useState<WebAiSettings>({ temperature: 1, topK: 3 })
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const appendLine = useCallback((type: LineType, text: string) => {
    setLines((current) => [...current, createLine(type, text)])
  }, [])

  const updateLastOutput = useCallback((text: string) => {
    setLines((current) => {
      const next = [...current]
      const lastIndex = findLastOutputIndex(next)
      if (lastIndex === -1) {
        next.push(createLine('output', text))
        return next
      }
      next[lastIndex] = { ...next[lastIndex], text }
      return next
    })
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  useEffect(() => {
    return () => destroyWebAiSession()
  }, [])

  const runGenerate = useCallback(
    async (targetCard: GameCard) => {
      if (!isWebAiSupported()) {
        appendLine(
          'error',
          'Web AI não encontrada. Use Chrome e habilite em chrome://flags/#prompt-api-for-gemini-nano',
        )
        return
      }

      const status = await getWebAiStatus()
      if (status === 'unavailable') {
        appendLine('error', 'Modelo indisponível neste dispositivo/navegador.')
        return
      }

      if (status === 'downloadable' || status === 'downloading') {
        appendLine('progress', 'Baixando modelo Gemini Nano pela primeira vez...')
      }

      appendLine('system', `Gerando efeito para "${targetCard.name}"...`)
      appendLine('output', '')

      try {
        const prompt = buildCardEffectPrompt(targetCard, cards)
        const rawEffect = await promptWebAiStreaming(
          prompt,
          (chunk) => {
            setLines((current) => {
              const next = [...current]
              const lastIndex = findLastOutputIndex(next)
              if (lastIndex === -1) return next
              next[lastIndex] = { ...next[lastIndex], text: next[lastIndex].text + chunk }
              return next
            })
          },
          settings,
          (percent) => appendLine('progress', `Download do modelo: ${percent}%`),
        )

        const effect = sanitizeGeneratedEffect(rawEffect)
        updateLastOutput(effect)
        onEffectGenerated(targetCard.id, effect)
        appendLine('system', 'Efeito aplicado na carta.')
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Falha ao gerar efeito.'
        appendLine('error', message)
      }
    },
    [appendLine, onEffectGenerated, settings, updateLastOutput],
  )

  const runCommand = useCallback(
    async (raw: string) => {
      const command = raw.trim()
      if (!command) return

      appendLine('input', `> ${command}`)
      const [name, ...args] = command.toLowerCase().split(/\s+/)

      switch (name) {
        case 'help':
          appendLine('system', HELP_TEXT)
          break

        case 'fechar':
        case 'sair':
          onClose()
          break

        case 'limpar':
        case 'clear':
          setLines([createLine('system', 'Terminal limpo.')])
          break

        case 'status': {
          if (!isWebAiSupported()) {
            appendLine('error', 'LanguageModel API não encontrada (use Chrome).')
            break
          }
          const status = await getWebAiStatus()
          appendLine('system', `Web AI: ${status}`)
          break
        }

        case 'temp': {
          const value = Number(args[0])
          if (Number.isNaN(value) || value < 0 || value > 2) {
            appendLine('error', 'Use: temp <0-2>  (ex: temp 1)')
            break
          }
          destroyWebAiSession()
          setSettings((current) => ({ ...current, temperature: value }))
          appendLine('system', `temperature = ${value}`)
          break
        }

        case 'topk':
        case 'top': {
          const value = Number(args[0])
          if (!Number.isInteger(value) || value < 1 || value > 8) {
            appendLine('error', 'Use: topk <1-8>  (ex: topk 3)')
            break
          }
          destroyWebAiSession()
          setSettings((current) => ({ ...current, topK: value }))
          appendLine('system', `topK = ${value}`)
          break
        }

        case 'original':
          onEffectGenerated(card.id, null)
          appendLine('system', 'Efeito original restaurado.')
          break

        case 'gerar': {
          const target = args[0] ? getCardById(cards, args[0]) : card
          if (!target) {
            appendLine('error', `Carta "${args[0]}" não encontrada.`)
            break
          }
          await runGenerate(target)
          break
        }

        default:
          appendLine('error', `Comando desconhecido: "${name}". Digite "help".`)
      }
    },
    [appendLine, card, onClose, onEffectGenerated, runGenerate],
  )

  const handleHintClick = (cmd: string) => {
    if (busy) return
    setInput(cmd)
    inputRef.current?.focus()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (busy || !input.trim()) return

    const command = input
    setInput('')
    setBusy(true)
    await runCommand(command)
    setBusy(false)
    inputRef.current?.focus()
  }

  return (
    <div className="biri-terminal mt-3 rounded-xl border border-lime-500/30 bg-black/80 shadow-[0_0_24px_rgba(132,204,22,0.12)] overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-lime-500/20 bg-lime-950/40 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-lime-500/80" />
          <span className="ml-2 text-[10px] uppercase tracking-widest text-lime-300/70">Web AI — Gemini Nano</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-[10px] uppercase tracking-widest text-lime-400/60 hover:text-lime-300"
        >
          fechar
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-lime-500/10 bg-lime-950/20 px-3 py-2">
        {COMMAND_HINTS.map(({ cmd, desc }) => (
          <button
            key={cmd}
            type="button"
            onClick={() => handleHintClick(cmd)}
            disabled={busy}
            title={desc}
            className="rounded border border-lime-500/20 bg-lime-950/30 px-2 py-0.5 font-mono text-[10px] text-lime-300/80 hover:border-lime-400/40 hover:text-lime-200 disabled:opacity-40"
          >
            {cmd}
          </button>
        ))}
      </div>

      <div className="h-48 overflow-y-auto p-4 font-mono text-sm leading-relaxed">
        {lines.map((line) => (
          <p
            key={line.id}
            className={`mb-1 whitespace-pre-wrap ${
              line.type === 'input'
                ? 'text-lime-300'
                : line.type === 'output'
                  ? 'text-lol-gold-light'
                  : line.type === 'error'
                    ? 'text-red-400'
                    : line.type === 'progress'
                      ? 'text-lime-400/70 italic'
                      : 'text-lol-gold-light/50'
            }`}
          >
            {line.text}
          </p>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex border-t border-lime-500/20">
        <span className="px-3 py-3 font-mono text-lime-400">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={busy}
          placeholder={busy ? 'processando...' : 'digite um comando (ex: gerar)'}
          className="flex-1 bg-transparent py-3 pr-4 font-mono text-sm text-lime-100 placeholder:text-lime-500/40 focus:outline-none disabled:opacity-50"
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  )
}
