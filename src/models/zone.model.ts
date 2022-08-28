import { Card } from './card.model';

export interface Zone {
  cards: Card[];
  containerType: ContainerType;
  selected: Card[];
  wasSelected: Card[];
  disableHover?: boolean;
  topCardType?: TopCardType;
}

export enum ContainerType {
  FREE_POSITION = 'free-position',
  SORTABLE = 'sortable',
  TOP_CARD = 'top-card',
  CARD_DIALOG='card-dialog',
  NONE = 'none',
}

export enum TopCardType {
  VISIBLE = 'visible',
  FACE_DOWN = 'face-down',
  HIDDEN = 'hidden',
}

export enum ZoneType {
  hand = 'Hand',
  deck = 'Deck',
  battlefield = 'Battlefield',
  graveyard = 'Graveyard',
  exile = 'Exile',
}
