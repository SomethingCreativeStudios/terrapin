import { Card } from '~/models/card.model';
import { BaseCard } from '../base.card';
import { ManaConditional } from '../models/abilities/mana-conditional.ability';
import { MetalcraftConditional } from '../models/conditional/metacraft.conditional';
import { TapCost } from '../models/costs/tap-cost';

export class MoxOpalCard extends BaseCard {
  static UUID = 'de2440de-e948-4811-903c-0bbe376ff64d';

  constructor(card: Card) {
    super(card);

    this.abilities.push(new ManaConditional(card, new MetalcraftConditional(), [new TapCost(card)], 'Tap: Add one mana'));
  }
}
