import { DeckActions } from '~/actions';
import { Condition } from '../../condition/condition';
import { OneShotEffect } from '../one-shot.effect';

export class MillXEffect extends OneShotEffect {
  constructor(cardId: string, public millCount: number) {
    super(cardId, Condition.createEmpty());
  }

  protected async effect(meta?: any): Promise<void> {
    DeckActions.millXCards(this.millCount);
  }
}
