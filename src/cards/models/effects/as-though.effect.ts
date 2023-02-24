import { AsThoughEffectType, Duration } from '../other-constants';
import { ContinuousEffect } from './continuous-effect.effect';

export class AsThoughEffect extends ContinuousEffect {
  public asThoughType = AsThoughEffectType.ACTIVATE_AS_INSTANT;
  public target = '';

  constructor(cardId: string, type: AsThoughEffectType, duration: Duration) {
    super(cardId, duration);

    this.asThoughType = type;
  }
}
