import { Card } from './card.model';

export interface Zone {
  cards: Card[];
  displayType: DisplayType;
  selected: Card[];
  wasSelected: Card[];
}

export enum DisplayType {
  FREE_POSITION = 'free-position',
  SORTABLE = 'sortable',
  NONE = 'none',
}
