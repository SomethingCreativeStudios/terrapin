import { Card } from '~/models/card.model';
import { BaseCard } from '../base.card';
import { CostAndPredicate } from '../models/effect';
import { AddManaCost } from '../models/effects/add-mana.cost';
import { AffinityCost } from '../models/effects/affinity.cost';
import { MetalcraftCost } from '../models/effects/metacraft.cost';
import { TapCost } from '../models/effects/tap.cost';

export class ThoughtcastCard extends BaseCard {
  constructor(card: Card) {
    super(card);
    this.castingCosts.push(new AffinityCost(card));
  }
}
