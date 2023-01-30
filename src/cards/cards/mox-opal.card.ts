import { Card } from '~/models/card.model';
import { BaseCard } from '../base.card';
import { CostAndPredicate } from '../models/effect';
import { AddManaCost } from '../models/effects/add-mana.cost';
import { MetalcraftCost } from '../models/effects/metacraft.cost';
import { TapCost } from '../models/effects/tap.cost';

export class MoxOpalCard extends BaseCard {
  constructor(card: Card) {
    super(card);
    this.costs.push(new CostAndPredicate([new TapCost(card), new MetalcraftCost(card), new AddManaCost(card)], 'Tap: Add one mana'));
  }
}
