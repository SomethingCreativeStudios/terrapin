export interface Card {
  name: string;
  manaCost: number;
  manaValue: number;
  convertedManaCost: number;
  power: number;
  toughness: number;
  cardTypes: string[];
  subTypes: string[];
  setCode: string;
  printings: string;
  layout: string;
  keywords: string[];
  flavorText: string;
  colorIdentity: CardColor[];
  colors: CardColor[];
  imagePath: string;
}

export interface ManaCost {
  genericCost: number;
  white: number;
  blue: number;
  black: number;
  red: number;
  green: number;
  xCount: number;
}

export interface CardMeta {
  scryfallId: string;
  scryfallIllustrationId: string;
  uuid: string;
}

export enum CardColor {
  WHITE = 'W',
  BLUE = 'U',
  BLACK = 'B',
  RED = 'R',
  GREEN = 'G',
  COLORLESS = 'C',
}

export function findColors(colorValues: string) {
  const colorMap = {
    '{W}': 'white',
    '{U}': 'blue',
    '{B}': 'black',
    '{R}': 'red',
    '{G}': 'green',
    '{X}': 'xCount',
  };

  const manaCost = {} as ManaCost;

  Object.entries(colorMap).forEach(([key, value]) => {
    // @ts-ignore
    manaCost[value] = colorValues.match(new RegExp(key, 'g'))?.length ?? 0;
  });

  manaCost.xCount = colorValues.match(/{X}/g)?.length ?? 0;
  manaCost.genericCost = Number.parseInt(colorValues.match(/{(\d*?)}/g)?.[0].replace('{', '').replace('}', '') ?? '0');

  return manaCost;
}

export function toCardColor(value: string) {
  switch (value) {
    case 'W':
      return CardColor.WHITE;
    case 'U':
      return CardColor.BLUE;
    case 'B':
      return CardColor.BLACK;
    case 'R':
      return CardColor.RED;
    case 'G':
      return CardColor.GREEN;

    default:
      return CardColor.COLORLESS;
  }
}
