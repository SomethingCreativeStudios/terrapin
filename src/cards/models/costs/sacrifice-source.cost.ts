import { CardActions } from '~/actions';
import { Cost } from './cost';

export class SacrificeSourceCost extends Cost {
  constructor(cardId: string) {
    super(cardId);
  }

  override async canPay(): Promise<boolean> {
    return true;
  }

  override async pay(): Promise<void> {
    CardActions.sacrifice(this.getCardState().baseCard);
  }
}
