import { Duration } from '../../other-constants';
import { ContinuousEffect } from '../continuous-effect.effect';
import { EffectType } from '../effect';

export enum CostModificationType {
  INCREASE_COST,
  REDUCE_COST,
  SET_COST,
}

export class CostModificationEffect extends ContinuousEffect {
  public worksOnStackOnly = false;

  constructor(cardId: string, duration: Duration, public modificationType: CostModificationType) {
    super(cardId, duration);

    this.effectType = EffectType.COST_MODIFICATION;
  }

  protected async effect(meta?: any): Promise<void> {
    console.log('Cost Modification Plain?');
  }
}
