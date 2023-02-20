import { Card } from '~/models/card.model';
import { BaseCard } from '../base.card';
import { BaseAbility } from '../models/abilities/base-ability';
import { SacCost } from '../models/costs/sac-cost';
import { TapCost } from '../models/costs/tap-cost';
import { ManaEffect } from '../models/effects/mana.effect';

export class LotusPetalCard extends BaseCard {
  static UUID = '32e5339e-9e4f-46f8-b305-f9d6d3ba8bb5';

  constructor(card: Card) {
    super(card);

    this.abilities.push(new BaseAbility([new TapCost(card), new SacCost(card)], [new ManaEffect(card, 1)], 'Tap Sac: Add one mana'));
  }
}
