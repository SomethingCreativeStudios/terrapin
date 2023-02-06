import { BaseCard } from '~/cards/base.card';
import { ZoneType } from './zone.model';

export interface Card {
  name: string;
  manaCost: ManaCost;
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
  cardId: string;
  oracleId: string;
  isToken?: boolean;
}

export interface CardState {
  isTapped: boolean;
  position?: CardPosition;
  zone?: ZoneType;
  targeted?: boolean;
  baseCard: Card;
  cardClass: BaseCard;
}

export interface CardPosition {
  x: number;
  y: number;
}
export interface ManaCost {
  hasPhyrexian: boolean;
  hasX: boolean;
  hasDual: boolean;
  mana: ManaPip[];
}

export interface ManaPip {
  types: ManaType[];
  genericCost: number;
}

export enum ManaType {
  WHITE = 'W',
  BLUE = 'U',
  BLACK = 'B',
  RED = 'R',
  GREEN = 'G',
  COLORLESS = 'C',
  GENERIC = 'G',
  PHYREXIAN = 'P',
  X = 'X',
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

export function convertPips(colorValues: string) {
  const colorMap = {
    W: ManaType.WHITE,
    U: ManaType.BLUE,
    B: ManaType.BLACK,
    R: ManaType.RED,
    G: ManaType.GREEN,
    P: ManaType.PHYREXIAN,
    X: ManaType.X,
  };

  const manaCost = {} as ManaCost;
  const regexMatch = colorValues.match(/{(.*?)}/g);

  const convertToPip = (value: string): ManaPip => {
    const parsedValue = value.replace('{', '').replace('}', '');

    if (parsedValue.match(/\d/g)?.length ?? 0 > 1) {
      return { genericCost: Number.parseInt(parsedValue), types: [] };
    }

    manaCost.hasX = manaCost.hasX || parsedValue === ManaType.X;
    manaCost.hasPhyrexian = manaCost.hasPhyrexian || parsedValue === ManaType.PHYREXIAN;

    // @ts-ignore
    return { genericCost: 0, types: [colorMap[parsedValue]] };
  };

  const handleDual = (match: string) => {
    return match
      .split('/')
      .map(convertToPip)
      .reduce((acc, pip) => ({ genericCost: pip.genericCost + acc.genericCost, types: acc.types.concat(pip.types) }), {
        genericCost: 0,
        types: [],
      } as ManaPip);
  };

  const manaTypes = regexMatch?.map((match) => {
    if (match.includes('/')) {
      manaCost.hasDual = true;
      return handleDual(match);
    }
    return convertToPip(match);
  });

  return { ...manaCost, mana: manaTypes } as ManaCost;
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
