import { ActivateIfConditionManaAbility } from '~/cards/models/abilities/mana/activate-if-condition-mana.ability';
import { BaseCard } from '~/cards/models/base.card';
import { MetalcraftCondition } from '~/cards/models/condition';
import { TapCost } from '~/cards/models/costs';
import { Card } from '~/models/card.model';

export class MoxOpalCard extends BaseCard {
  static UUID = 'de2440de-e948-4811-903c-0bbe376ff64d';

  constructor(card: Card) {
    super(card);

    this.abilities.push(new ActivateIfConditionManaAbility(card.cardId, [new TapCost(card.cardId)], new MetalcraftCondition()));
  }
}
