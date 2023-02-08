import {} from '~/actions/hand.action';
import { DeckActions } from '~/actions';
import { Card } from '~/models/card.model';
import { Effect } from './effect';

export class MillEffect extends Effect {
  constructor(private number: number, card: Card, label: string) {
    super(card, label);
  }

  do(): void {
    DeckActions.millXCards(this.number);
  }
}
