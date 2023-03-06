import { AnyColorManaAbility } from '~/cards/models/abilities/mana/any-color-mana.ability';
import { BaseCard } from '~/cards/models/base.card';
import { SacrificeSourceCost, TapCost } from '~/cards/models/costs';
import { Card } from '~/models/card.model';

export class LotusPetalCard extends BaseCard {
  static UUID = '32e5339e-9e4f-46f8-b305-f9d6d3ba8bb5';

  constructor(card: Card) {
    super(card);

    this.abilities.push(new AnyColorManaAbility(card.cardId, [new TapCost(card.cardId), new SacrificeSourceCost(card.cardId)]));
  }
}
