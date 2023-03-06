import { SimpleStaticAbility, EnterTheBattlefieldTriggeredAbility, SimpleActivatedAbility } from '~abilities';
import { BaseCard } from '~base-card';
import { TapCost } from '~costs';
import { SpellCostReductionForEachSourceEffect, AsThoughEffect } from '~effects';
import { MillXEffect } from '~/cards/models/effects/mill';
import { AsThoughEffectType, Duration } from '~/cards/models/other-constants';
import { useDialog, useGameItems } from '~/composables';
import { getArtifactCount } from '~/counts';
import { CardTypeFilter, CardWhiteListZoneFilter } from '~/filters/card.filter';
import { Card } from '~/models/card.model';
import { PredicateCollection } from '~/models/predicates.model';
import { ZoneType } from '~/models/zone.model';

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
        [new TapCost(card.cardId)],
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
