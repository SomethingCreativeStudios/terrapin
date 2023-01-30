import { Card } from '~/models/card.model';
import { CardCost } from '../effect';
import { useCard } from '~/composables';

export class TapCost extends CardCost {
  constructor(card: Card) {
    super(card, 'Tap');
  }

  meetsRequirements(): boolean {
    return !this.getMeta()?.isTapped;
  }

  pay(): void {
    const { tapOrUntapCard } = useCard();
    tapOrUntapCard([this.getMeta()?.baseCard?.cardId || '']);
  }
}
