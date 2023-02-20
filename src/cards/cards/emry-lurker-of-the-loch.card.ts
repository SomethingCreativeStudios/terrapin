import { Card } from '~/models/card.model';
import { BaseCard } from '../base.card';
import { BaseAbility } from '../models/abilities/base-ability';
import { AffinityCastingCost } from '../models/casting-cost/affinity.casting-cost';
import { TapCost } from '../models/costs/tap-cost';
import { CastCardsInGraveyardEffect } from '../models/effects/cast-cards-in-graveyard.effect';
import { MillEffect } from '../models/effects/mill.effect';
import { EnterTheBattlefieldWatcher } from '../models/watchers/EnterTheBattlefieldWatcher';

export class EmryLurkerOfTheLochCard extends BaseCard {
  static UUID = 'da3e7d3d-2ca0-40c3-9602-fca37c92f507';

  constructor(card: Card) {
    super(card);

    this.castingCosts.push(new AffinityCastingCost(card, 'Cast'));

    new EnterTheBattlefieldWatcher(card, new MillEffect(4, card, 'Mill')).watch();

    this.abilities.push(new BaseAbility([new TapCost(card)], [new CastCardsInGraveyardEffect(1, 1, card, '')], 'Cast Card In Graveyard'));
  }
}
