import { Card } from './card.model';

export interface Zone {
  cards: Card[];
  displayType: DisplayType;
}

export enum DisplayType {
  FREE_POSITION = 'free-position',
  SORTABLE = 'sortable',
  NONE = 'none',
}
