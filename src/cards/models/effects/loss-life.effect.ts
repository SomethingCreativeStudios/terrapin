import { TrackerActions } from '~/actions';
import { Card } from '~/models/card.model';
import { Effect } from './effect';

export class LossLifeEffect extends Effect {
  constructor(card: Card, private amount: number) {
    super(card);
  }

  async do(): Promise<void> {
    TrackerActions.takeDamage(this.amount);
  }
}
