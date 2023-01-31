import {} from '~/actions/hand.action';
import { useDeck } from '~/composables';
import { Card } from '~/models/card.model';
import { Effect } from './effect';

export class DrawEffect extends Effect {
  constructor(private numberToDraw: number, card: Card, label: string) {
    super(card, label);
  }

  do(): void {
    const { drawXCards } = useDeck();
    drawXCards(this.numberToDraw);
  }
}
