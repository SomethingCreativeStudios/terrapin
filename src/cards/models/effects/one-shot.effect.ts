import { Condition } from '../condition/condition';
import { Effect, EffectType } from './effect';

export class OneShotEffect extends Effect {
  constructor(cardId: string, condition: Condition) {
    super(cardId, condition);
    this.effectType = EffectType.ONE_SHOT;
  }

  protected async effect(meta?: any): Promise<void> {}
}
