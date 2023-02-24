import { useDialog, useGameItems } from '~/composables';
import { getArtifactCount } from '~/counts';
import { CardTypeFilter, CardWhiteListZoneFilter } from '~/filters/card.filter';
import { Card } from '~/models/card.model';
import { PredicateCollection } from '~/models/predicates.model';
import { ZoneType } from '~/models/zone.model';
import { BaseCard } from '../base.card';
import { EnterTheBattlefieldTriggeredAbility } from '../models/abilities/enter-the-battlefield/enter-the-battlefield-triggered.ability';
import { SimpleActivatedAbility } from '../models/abilities/simple-activated.ability';
import { SimpleStaticAbility } from '../models/abilities/simple-static-ability';
import { DefaultCastingCost } from '../models/casting-cost/default.casting-cost';
import { TapCost } from '../models/costs/tap-cost';
import { AsThoughEffect } from '../models/effects/as-though.effect';
import { SpellCostReductionForEachSourceEffect } from '../models/effects/cost-modifications/spell-cost-reduction-foreach-source.effect';
import { MillXEffect } from '../models/effects/mill/mill-x.effect';
import { AsThoughEffectType, Duration } from '../models/other-constants';

export class EmryLurkerOfTheLochCard extends BaseCard {
  static UUID = 'da3e7d3d-2ca0-40c3-9602-fca37c92f507';

  constructor(card: Card) {
    super(card);

    // Add abilities to stack after checking

    this.abilities.push(new SimpleStaticAbility(card.cardId, [SpellCostReductionForEachSourceEffect.genericReduction(card.cardId, 1, getArtifactCount)], [ZoneType.stack]));

    this.abilities.push(new EnterTheBattlefieldTriggeredAbility(card.cardId, [new MillXEffect(card.cardId, 4)]));

    this.abilities.push(
      new SimpleActivatedAbility(
        card.cardId,
        [new EmryCustomEffect(card.cardId)],
        [new TapCost(card)],
        '{T}: Choose target artifact card in your graveyard. You may cast that card this turn.'
      )
    );
  }
}

export class EmryCustomEffect extends AsThoughEffect {
  constructor(cardId: string) {
    super(cardId, AsThoughEffectType.PLAY_FROM_NOT_OWN_HAND_ZONE, Duration.END_OF_TURN);
  }

  override async effect(meta?: any): Promise<void> {
    const { findTargets } = useDialog();
    const { addGlobalEffect } = useGameItems();
    const artifactFilter = new PredicateCollection<Card>([new CardTypeFilter(['Artifact']), new CardWhiteListZoneFilter([ZoneType.graveyard])]);

    const targets = await findTargets('Pick card(s) in graveyard to Cast', [ZoneType.graveyard], {
      targetFilter: artifactFilter,
      minTargets: 1,
      maxTargets: 1,
    });

    this.target = targets[0];

    addGlobalEffect(this);
  }
}
