export type WebAiStatus = LanguageModelAvailability

export interface WebAiSettings {
  temperature: number
  topK: number
}

const DEFAULT_SETTINGS: WebAiSettings = {
  temperature: 1,
  topK: 3,
}

let cachedSession: LanguageModelSession | null = null
let cachedSettings: WebAiSettings | null = null

export function isWebAiSupported(): boolean {
  return typeof LanguageModel !== 'undefined'
}

export async function getWebAiStatus(): Promise<WebAiStatus> {
  if (!isWebAiSupported()) return 'unavailable'
  return LanguageModel!.availability({ languages: ['pt', 'en'] })
}

export async function createWebAiSession(
  settings: WebAiSettings = DEFAULT_SETTINGS,
  onDownloadProgress?: (percent: number) => void,
): Promise<LanguageModelSession> {
  if (!isWebAiSupported()) {
    throw new Error('Web AI não disponível neste navegador.')
  }

  const sameSettings =
    cachedSettings?.temperature === settings.temperature && cachedSettings?.topK === settings.topK

  if (cachedSession && sameSettings) {
    return cachedSession
  }

  if (cachedSession) {
    cachedSession.destroy()
    cachedSession = null
  }

  const status = await getWebAiStatus()
  if (status === 'unavailable') {
    throw new Error('Modelo indisponível. Use Chrome com Web AI habilitada.')
  }

  const session = await LanguageModel!.create({
    temperature: settings.temperature,
    topK: settings.topK,
    initialPrompts: [
      {
        role: 'system',
        content:
          'Você escreve apenas o efeito de cartas de um jogo ARAM entre amigos. Responda somente com o texto do efeito em português, sem rótulos, sem nome da carta, sem explicações.',
      },
    ],
    monitor(monitor) {
      monitor.addEventListener('downloadprogress', (event) => {
        const progress = event as Event & { loaded?: number }
        if (typeof progress.loaded === 'number' && onDownloadProgress) {
          onDownloadProgress(Math.round(progress.loaded * 100))
        }
      })
    },
  })

  cachedSession = session
  cachedSettings = settings
  return session
}

export async function promptWebAi(
  input: string,
  settings: WebAiSettings = DEFAULT_SETTINGS,
  onDownloadProgress?: (percent: number) => void,
): Promise<string> {
  const session = await createWebAiSession(settings, onDownloadProgress)
  const response = await session.prompt(input)
  return response.trim()
}

export async function promptWebAiStreaming(
  input: string,
  onChunk: (chunk: string) => void,
  settings: WebAiSettings = DEFAULT_SETTINGS,
  onDownloadProgress?: (percent: number) => void,
): Promise<string> {
  const session = await createWebAiSession(settings, onDownloadProgress)
  const stream = session.promptStreaming(input)
  const reader = stream.getReader()
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    fullText += value
    onChunk(value)
  }

  return fullText.trim()
}

export function destroyWebAiSession(): void {
  cachedSession?.destroy()
  cachedSession = null
  cachedSettings = null
}
