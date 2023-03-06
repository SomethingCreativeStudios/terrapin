import { ZoneType } from '~/models/zone.model';
import { Cost } from '../costs/cost';
import { Effect } from '../effects/effect';
import { Ability, AbilityType } from './ability';

export class ActivatedAbility extends Ability {
  constructor(cardId: string, costs: Cost[], effects: Effect[], zones: ZoneType[]) {
    super(cardId, costs, effects, AbilityType.ACTIVATED, zones);
  }

  async ability(): Promise<void> {
    await this.doAllEffects();
  }
}
