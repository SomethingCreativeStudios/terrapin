import { Card, ManaType } from '~/models/card.model';
import { BaseCard } from '../base.card';
import { BaseAbility } from '../models/abilities/base-ability';
import { SacCost } from '../models/costs/sac-cost';
import { TapCost } from '../models/costs/tap-cost';
import { DrawEffect } from '../models/effects/draw.effect';
import { SpecificManaEffect } from '../models/effects/specifc-mana.effect';
import { WatcherEffect } from '../models/effects/watcher.effect';
import { UpkeepWatcher } from '../models/watchers/UpkeepWatcher';

export class SeatOfTheSynodCard extends BaseCard {
  static UUID = '39451b4d-cd7a-40da-b457-cb51b609173f';

  constructor(card: Card) {
    super(card);

    this.abilities.push(new BaseAbility([new TapCost(card)], new SpecificManaEffect(card, ManaType.BLUE), 'Add U'));
  }
}
