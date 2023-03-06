import { useCard } from '~/composables';
import { Card } from '~/models/card.model';
import { Cost } from './cost';

export class TapCost extends Cost {
  constructor(cardId: string) {
    super(cardId);
  }

  async canPay(): Promise<boolean> {
    return !this.getCardState()?.isTapped;
  }

  async pay(): Promise<void> {
    const { tapOrUntapCard } = useCard();
    tapOrUntapCard([this.getCardState()?.baseCard?.cardId || '']);
  }
}
