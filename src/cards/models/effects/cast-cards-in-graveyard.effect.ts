import {} from '~/actions/hand.action';
import { Card } from '~/models/card.model';
import { useDialog, useGameState } from '~/composables';
import { Effect } from './effect';
import { DefaultCastingCost } from '../casting-cost/default.casting-cost';
import { ZoneType } from '~/models/zone.model';

export class CastCardsInGraveyardEffect extends Effect {
  constructor(private targetNumber: number, card: Card, label: string) {
    super(card, label);
  }

  async do(): Promise<void> {
    const { findTargets } = useDialog();
    const targets = await findTargets('Pick card(s) in graveyard to Cast');

    targets.forEach((target) => {
      const { getMeta } = useGameState();
      const state = getMeta(target).value;

      state.cardClass.castingCosts.push(new DefaultCastingCost(state.baseCard, state.position || { x: 0, y: 0 }, 'Cast', [ZoneType.graveyard]));
    });
  }
}
