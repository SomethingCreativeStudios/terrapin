import { TrackerActions } from '~/actions';
import { Card, ManaType } from '~/models/card.model';
import { Effect } from './effect';

export class SpecificManaEffect extends Effect {
  constructor(card: Card, private mana: ManaType, private amount = 1) {
    super(card);
  }

  async do(): Promise<void> {
    TrackerActions.addMana(this.mana, this.amount);
  }
}
