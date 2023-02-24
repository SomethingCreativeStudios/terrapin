import { Card } from '~/models/card.model';
import { CardActions } from '~/actions';
import { Cost } from './cost';

export class SacCost extends Cost {
  constructor(card: Card) {
    super(card, 'Sac');
  }

  async canPay(): Promise<boolean> {
    return true;
  }

  async pay(): Promise<void> {
    CardActions.sacrifice(this.getMeta().baseCard);
  }
}
