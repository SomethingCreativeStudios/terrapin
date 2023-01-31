import { v4 as uuid } from 'uuid';
import { Cost } from '../costs/cost';
import { Effect } from '../effects/effect';
import { AbilityType } from '../xmage/ability-type.enum';
export abstract class Ability {
  public id = uuid();

  public type = AbilityType.ACTIVATED;

  constructor(public costs: Cost[], public effect: Effect, public text: string) {}

  abstract canDo(): boolean;

  abstract do(): void;
}
