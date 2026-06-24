import type { GameCard } from '../types/card'
import biriChado from '../assets/biri-chado.png'
import biriCheco from '../assets/biri-checo.png'
import biriJao from '../assets/biri-jao.png'
import biriPedro from '../assets/biri-pedro.png'
import ed from '../assets/ed.png'
import joao from '../assets/joao.png'
import machado from '../assets/machado.png'
import pacheco from '../assets/pacheco.png'
import pedro from '../assets/pedro.png'

export const cards: GameCard[] = [
  {
    id: 'biri-chado',
    name: 'Biri Chado',
    playerName: 'machadovsk',
    playerAvatar: biriChado,
    catchphrase: '"time lixo, só troll"',
    description:
      'Time todo joga a favor do Machado — tenha quantos tanks e suportes que der pra ter e deixa ele de carry.',
    rarity: 'gold',
  },
  {
    id: 'biri-pedro',
    name: 'Biri Pedro',
    playerName: 'Nezuko Alcoolatra',
    playerAvatar: biriPedro,
    catchphrase: '"O Biri te escolheu. Boa sorte."',
    description:
      'O time todo vai fazer a comunicação do jogo em inglês e jogar com algum feitiço troll + bola de gelo.',
    rarity: 'gold',
  },
  {
    id: 'biri-checo',
    name: 'Biri Checo',
    playerName: 'Pacheco',
    playerAvatar: biriCheco,
    catchphrase: '"É troll, confia."',
    description: 'O time todo vai ir até a morte level 3, pacheco vai escolher os picks de cada um e não pode dar gg batendo no nexus, vai ter que deixar os minions darem gg.',
    rarity: 'gold',
  },
  {
    id: 'biri-jao',
    name: 'Biri Jão',
    playerName: 'shanks9',
    playerAvatar: biriJao,
    catchphrase: '"Stack hoje, stack amanhã, stack pra sempre."',
    description: 'Obrigatoriamente todos os jogadores têm que fazer coração de aço.',
    rarity: 'gold',
  },
  {
    id: 'ed',
    name: 'Ed',
    playerName: 'Lulista',
    playerAvatar: ed,
    catchphrase: '"Tá chapando não né ?"',
    description: 'Ed vai escolher a build do jogador que ele quiser.',
    rarity: 'comum',
  },
  {
    id: 'joao',
    name: 'João',
    playerName: 'Shanks9',
    playerAvatar: joao,
    catchphrase: '"Stack Stack Stack"',
    description: 'Escolha um jogador pra fazer coração de aço e jogar no stack mentality.',
    rarity: 'comum',
  },
  {
    id: 'machado',
    name: 'Machado',
    playerName: 'machadovsk',
    playerAvatar: machado,
    catchphrase: '"Você não ta trollando não né ?"',
    description: 'Escolha um jogador do seu time que não vai poder jogar de flash.',
    rarity: 'comum',
  },
  {
    id: 'pacheco',
    name: 'Pacheco',
    playerName: 'Pacheco',
    playerAvatar: pacheco,
    catchphrase: '"Na lane eu perco, na fight eu carrego"',
    description: 'O jogador escolhe os campeões do time e escolhe quem vai jogar com quem.',
    rarity: 'comum',
  },
  {
    id: 'pedro',
    name: 'Pedro',
    playerName: 'Nezuko alcoolatra',
    playerAvatar: pedro,
    catchphrase: '"Kayle e um sonho"',
    description:
      'O jogador poderá escolher um campeão de escalar pra alguém do seu time. Caso não tenha campeão de escalar, pegue um campeão ruim pra jogar.',
    rarity: 'comum',
  },
]
