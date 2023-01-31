import { useCard } from '~/composables';
import { Card } from '~/models/card.model';
import { Cost } from './cost';

export class TapCost extends Cost {
  constructor(card: Card) {
    super(card, 'Tap');
  }

  canPay(): boolean {
    return !this.getMeta()?.isTapped;
  }

  pay(): void {
    const { tapOrUntapCard } = useCard();
    tapOrUntapCard([this.getMeta()?.baseCard?.cardId || '']);
  }
}
