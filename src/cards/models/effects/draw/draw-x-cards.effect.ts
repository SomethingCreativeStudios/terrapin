import { DrawXCards } from '~/actions/deck.action';
import { Condition } from '../../condition';
import { OneShotEffect } from '../one-shot.effect';

export class DrawXCardsEffect extends OneShotEffect {
  constructor(cardId: string, private cardToDraw: number) {
    super(cardId, Condition.createEmpty());
  }

  public async do(meta?: any): Promise<void> {
    DrawXCards(this.cardToDraw);
  }
}
