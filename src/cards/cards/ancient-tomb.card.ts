import { Card, ManaType } from '~/models/card.model';
import { BaseCard } from '../base.card';
import { BaseAbility } from '../models/abilities/base-ability';
import { TapCost } from '../models/costs/tap-cost';
import { LossLifeEffect } from '../models/effects/loss-life.effect';
import { SpecificManaEffect } from '../models/effects/specifc-mana.effect';

export class AncientTombCard extends BaseCard {
  static UUID = '23467047-6dba-4498-b783-1ebc4f74b8c2';

  constructor(card: Card) {
    super(card);

    this.abilities.push(new BaseAbility([new TapCost(card)], [new SpecificManaEffect(card, ManaType.COLORLESS, 2), new LossLifeEffect(card, 2)], 'Add 2 Colorless, deal 2 life'));
  }
}
