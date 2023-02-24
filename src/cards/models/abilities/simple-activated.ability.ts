import { ZoneType } from '~/models/zone.model';
import { Cost } from '../costs/cost';
import { Effect } from '../effects/effect';
import { ActivatedAbility } from './activated.ability';

export class SimpleActivatedAbility extends ActivatedAbility {
  constructor(cardId: string, effects: Effect[], costs: Cost[], label: string) {
    super(cardId, costs, effects, [ZoneType.battlefield]);

    this.label = label;
  }
}
