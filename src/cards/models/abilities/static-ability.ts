import { ZoneType } from '~/models/zone.model';
import { Effect } from '../effects/effect';
import { Ability, AbilityType } from './ability';

export class StaticAbility extends Ability {
  constructor(public cardId: string, public effects: Effect[], public validZones = [ZoneType.battlefield]) {
    super(cardId, [], effects, AbilityType.STATIC, validZones);
  }

  async canDo(): Promise<boolean> {
    return this.defaultCanDo();
  }

  async ability(): Promise<void> {
    await this.doEffects();
  }
}
