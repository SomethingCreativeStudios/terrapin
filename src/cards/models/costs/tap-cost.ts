import { useCard } from '~/composables';
import { Card } from '~/models/card.model';
import { Cost } from './cost';

export class TapCost extends Cost {
  constructor(card: Card) {
    super(card, 'Tap');
  }

  async canPay(): Promise<boolean> {
    return !this.getMeta()?.isTapped;
  }

  async pay(): Promise<void> {
    const { tapOrUntapCard } = useCard();
    tapOrUntapCard([this.getMeta()?.baseCard?.cardId || '']);
  }
}
