import { Card } from '~/models/card.model';
import { CardActions } from '~/actions';
import { Cost } from './cost';

export class SacCost extends Cost {
  constructor(card: Card) {
    super(card, 'Sac');
  }

  canPay(): boolean {
    return true;
  }

  pay(): void {
    CardActions.sacrifice(this.getMeta().baseCard);
  }
}
