import { ActivatedAbility, SimpleStaticAbility } from '~/cards/models/abilities';
import { BaseCard } from '~/cards/models/base.card';
import { DrawXCardsEffect, SpellCostReductionForEachSourceEffect } from '~/cards/models/effects';
import { getArtifactCount } from '~/counts';
import { Card } from '~/models/card.model';
import { ZoneType } from '~/models/zone.model';

export class ThoughtcastCard extends BaseCard {
  static UUID = 'cce9bbff-82dc-4b2f-addd-d6715588de20';

  constructor(card: Card) {
    super(card);

    this.abilities.push(new SimpleStaticAbility(card.cardId, [SpellCostReductionForEachSourceEffect.genericReduction(card.cardId, 1, getArtifactCount)], [ZoneType.stack]));

    this.spellAbility.push(new ActivatedAbility(card.cardId, [], [new DrawXCardsEffect(card.cardId, 2)], [ZoneType.stack]));
  }
}
