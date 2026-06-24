# Biri LoL — Cartas ARAM

Projeto de diversão para jogar ARAM no League of Legends com os amigos. Cada carta representa um jogador com uma frase de efeito e uma habilidade especial (mockada por enquanto).

## Stack

- React + TypeScript
- Vite
- Tailwind CSS v4

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

## Estrutura

```
src/
├── components/
│   ├── CardCarousel.tsx   # Carrossel de cartas
│   └── GameCard.tsx       # Thumbnail e detalhe da carta
├── data/
│   └── cards.ts           # 7 cartas mockadas (edite aqui!)
├── types/
│   └── card.ts            # Tipos TypeScript
└── App.tsx
```

## Personalizar

Edite `src/data/cards.ts` para trocar nomes, frases, avatares e descrições dos seus amigos.

Para fotos reais, substitua `playerAvatar` por URLs locais (ex: `/avatars/biri.jpg`) e coloque as imagens em `public/avatars/`.
