import { addMana } from '~/actions/tracker.action';
import { ManaType } from '~/models/card.model';
import { Condition } from '../../condition';
import { OneShotEffect } from '../one-shot.effect';

export class ManaEffect extends OneShotEffect {
  constructor(cardId: string, private manaType: ManaType, private amount = 1) {
    super(cardId, Condition.createEmpty());
  }

  protected async effect(meta?: any): Promise<void> {
    addMana(this.manaType, this.amount);
  }
}
