interface LanguageModelPrompt {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface LanguageModelCreateOptions {
  temperature?: number
  topK?: number
  initialPrompts?: LanguageModelPrompt[]
  monitor?: (monitor: EventTarget) => void
}

interface LanguageModelSession {
  prompt(input: string): Promise<string>
  promptStreaming(input: string): ReadableStream<string>
  destroy(): void
}

type LanguageModelAvailability = 'unavailable' | 'downloadable' | 'downloading' | 'available'

interface LanguageModelStatic {
  availability(options?: { languages?: string[] }): Promise<LanguageModelAvailability>
  create(options?: LanguageModelCreateOptions): Promise<LanguageModelSession>
  params(): Promise<{ defaultTopK: number; defaultTemperature: number }>
}

declare const LanguageModel: LanguageModelStatic | undefined
