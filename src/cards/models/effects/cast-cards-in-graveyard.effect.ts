import {} from '~/actions/hand.action';
import { Card } from '~/models/card.model';
import { useDialog, useGameState } from '~/composables';
import { Effect } from './effect';
import { DefaultCastingCost } from '../casting-cost/default.casting-cost';
import { ZoneType } from '~/models/zone.model';
import { CardTypeFilter, CardWhiteListZoneFilter } from '~/filters/card.filter';
import { PredicateCollection } from '~/models/predicates.model';

export class CastCardsInGraveyardEffect extends Effect {
  constructor(private minNumber: number, private maxNumber: number, card: Card, label: string) {
    super(card, label);
  }

  async do(): Promise<void> {
    const { findTargets } = useDialog();
    const artifactFilter = new PredicateCollection<Card>([new CardTypeFilter(['Artifact']), new CardWhiteListZoneFilter([ZoneType.graveyard])]);

    const targets = await findTargets('Pick card(s) in graveyard to Cast', [ZoneType.graveyard], {
      targetFilter: artifactFilter,
      minTargets: this.minNumber,
      maxTargets: this.maxNumber,
    });

    targets.forEach((target) => {
      const { getMeta } = useGameState();
      const state = getMeta(target).value;

      state.cardClass.castingCosts.push(new DefaultCastingCost(state.baseCard, state.position || { x: 0, y: 0 }, 'Cast', [ZoneType.graveyard]));
    });
  }
}
