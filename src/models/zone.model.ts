import { Card } from './card.model';

export interface Zone {
  cards: Card[];
  displayType: DisplayType;
}

export enum DisplayType {
  TOP_LEFT = 'top-left',
  FLEX_ROW = 'flex-row',
  NONE = 'none',
}
