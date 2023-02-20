import { Ability } from './ability';

export class BaseAbility extends Ability {
  canDo(): boolean {
    return this.costs.every((cost) => cost.canPay());
  }

  do(): void {
    if (this.canDo()) {
      this.costs.forEach((cost) => cost.pay());
      this.effects.forEach((effect) => effect.do());
    }
  }
}
