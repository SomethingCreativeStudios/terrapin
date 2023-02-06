import { Card } from '~/models/card.model';
import { BaseCard } from '../base.card';
import { DrawAbility } from '../models/abilities/draw.ability';
import { AffinityCastingCost } from '../models/casting-cost/affinity.casting-cost';

export class ThoughtcastCard extends BaseCard {
  static UUID = 'cce9bbff-82dc-4b2f-addd-d6715588de20';

  constructor(card: Card) {
    super(card);

    this.castingCosts.push(new AffinityCastingCost(card, 'Cast'));
    this.castingCosts.push(new AffinityCastingCost(card, 'Cast Affinity'));

    this.abilities.push(new DrawAbility(card, 2));
  }
}
