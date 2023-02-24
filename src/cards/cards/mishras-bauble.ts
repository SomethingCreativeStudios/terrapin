import { Card } from '~/models/card.model';
import { BaseCard } from '../base.card';
import { BaseAbility } from '../models/abilities/base-ability';
import { SacCost } from '../models/costs/sac-cost';
import { TapCost } from '../models/costs/tap-cost';
import { DrawEffect } from '../models/effects/draw.effect';
import { WatcherEffect } from '../models/effects/watcher.effect';
import { UpkeepWatcher } from '../models/watchers/UpkeepWatcher';

export class MishrasBaubleCard extends BaseCard {
  static UUID = '63afc3d1-7653-476e-838f-fc18d4a62a21';

  constructor(card: Card) {
    super(card);

    // TODO: All abilities should use the stack... except mana abilities
    // Need ability types

    const effect = new WatcherEffect(card, new UpkeepWatcher(card, [new DrawEffect(1, card, 'Draw Card')], true));
    this.abilities.push(new BaseAbility([new TapCost(card), new SacCost(card)], [effect], 'Look at top card of a players library.\n Draw card at next upkeep'));
  }
}
