import { AtBeginOfNextUpkeepDelayedTriggeredAbility, SimpleActivatedAbility } from '~/cards/models/abilities';
import { BaseCard } from '~/cards/models/base.card';
import { SacrificeSourceCost, TapCost } from '~/cards/models/costs';
import { DrawXCardsEffect } from '~/cards/models/effects';
import { DelayedTriggeredAbilityEffect } from '~/cards/models/effects/delayed-triggered-ability.effect';
import { Duration } from '~/cards/models/other-constants';
import { Card } from '~/models/card.model';

export class MishrasBaubleCard extends BaseCard {
  static UUID = '63afc3d1-7653-476e-838f-fc18d4a62a21';

  constructor(card: Card) {
    super(card);

    const ability = new SimpleActivatedAbility(
      card.cardId,
      [new DelayedTriggeredAbilityEffect(card.cardId, new AtBeginOfNextUpkeepDelayedTriggeredAbility(card.cardId, [new DrawXCardsEffect(card.cardId, 1)], Duration.ONE_USE))],
      [new TapCost(card.cardId), new SacrificeSourceCost(card.cardId)],
      "Tap: Sac ~: Look at the top card of target player's library. Draw a card the beginning of the next turn's upkeep."
    );

    this.abilities.push(ability);
  }
}
