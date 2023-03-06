import { ZoneType } from '~/models/zone.model';
import { Cost } from '../../costs';
import { ActivatedAbility } from '../activated.ability';

export class ActivatedManaAbility extends ActivatedAbility {
  constructor(cardId: string, costs: Cost[], zones = [ZoneType.battlefield]) {
    super(cardId, costs, [], zones);
  }
}
