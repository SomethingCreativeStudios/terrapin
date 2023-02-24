export interface Zone {
  cardIds: string[];
  containerType: ContainerType;
  selected: string[];
  wasSelected: string[];
  disableHover?: boolean;
  topCardType?: TopCardType;
}

export enum ContainerType {
  FREE_POSITION = 'free-position',
  SORTABLE = 'sortable',
  TOP_CARD = 'top-card',
  CARD_DIALOG = 'card-dialog',
  NONE = 'none',
}

export enum TopCardType {
  VISIBLE = 'visible',
  FACE_DOWN = 'face-down',
  HIDDEN = 'hidden',
}

export enum ZoneType {
  none = 'none',
  hand = 'Hand',
  deck = 'Deck',
  battlefield = 'Battlefield',
  graveyard = 'Graveyard',
  exile = 'Exile',
  stack = 'Stack',
}
