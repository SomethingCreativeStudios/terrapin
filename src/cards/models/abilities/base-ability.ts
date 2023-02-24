import { Ability } from './ability';

export class BaseAbility extends Ability {
  async ability(): Promise<void> {
    if (await this.canDo()) {
      this.costs.forEach((cost) => cost.pay());
      this.effects.forEach((effect) => effect.do());
    }
  }
}
