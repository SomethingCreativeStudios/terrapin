import { Card } from '~/models/card.model';
import { Conditional } from '../conditional/conditional';
import { Cost } from '../costs/cost';
import { ManaEffect } from '../effects/mana.effect';
import { Ability } from './ability';

export class ManaConditional extends Ability {
  constructor(card: Card, private conditional: Conditional, costs: Cost[], label: string) {
    super(costs, new ManaEffect(card), label);
  }

  canDo(): boolean {
    if (!this.conditional.canMeet()) return false;
    return this.costs.every((cost) => cost.canPay());
  }

  do(): void {
    this.costs.forEach((cost) => cost.pay());
    this.effect.do();
  }
}
