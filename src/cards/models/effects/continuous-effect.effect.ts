import { Duration } from '../other-constants';
import { Effect, EffectType } from './effect';

export class ContinuousEffect extends Effect {
  constructor(cardId: string, public duration: Duration) {
    super(cardId);
    this.effectType = EffectType.CONTINUOUS;
  }

  protected async effect(meta?: any): Promise<void> {}
}
