import { Card } from '~/models/card.model';
import { ZoneType } from '~/models/zone.model';
import { Conditional } from '../conditional/conditional';
import { Cost } from '../costs/cost';
import { ManaEffect } from '../effects/mana.effect';
import { Ability } from './ability';

export class ManaConditional extends Ability {
  constructor(card: Card, private conditional: Conditional, costs: Cost[], label: string, validZones = [ZoneType.battlefield]) {
    super(costs, new ManaEffect(card), label, validZones);
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
