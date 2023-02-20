import { v4 as uuid } from 'uuid';
import { ZoneType } from '~/models/zone.model';
import { Cost } from '../costs/cost';
import { Effect } from '../effects/effect';
import { AbilityType } from '../xmage/ability-type.enum';
export abstract class Ability {
  public id = uuid();

  public type = AbilityType.ACTIVATED;

  constructor(public costs: Cost[], public effects: Effect[], public text: string, public validZones = [ZoneType.battlefield]) {}

  abstract canDo(): boolean;

  abstract do(): void;
}
