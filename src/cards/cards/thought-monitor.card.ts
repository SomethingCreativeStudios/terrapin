import { Card } from '~/models/card.model';
import { BaseCard } from '../base.card';
import { AffinityCastingCost } from '../models/casting-cost/affinity.casting-cost';
import { DrawEffect } from '../models/effects/draw.effect';
import { EnterTheBattlefieldWatcher } from '../models/watchers/EnterTheBattlefieldWatcher';

export class ThoughtMonitorCard extends BaseCard {
  static UUID = '9deded8b-cec4-4ede-a50b-131404d456d4';

  constructor(card: Card) {
    super(card);

    this.castingCosts.push(new AffinityCastingCost(card, 'Cast'));

    new EnterTheBattlefieldWatcher(card, new DrawEffect(2, card, 'Draw 2')).watch();
  }
}
