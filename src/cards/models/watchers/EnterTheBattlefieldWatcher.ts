import { Card } from '~/models/card.model';
import { Effect } from '../effects/effect';
import { Watcher } from './watcher';
import { zoneChangesSubject } from '~/subjects';
import { ZoneType } from '~/models/zone.model';

export class EnterTheBattlefieldWatcher extends Watcher {
  constructor(card: Card, effect: Effect) {
    super(card, effect);
  }

  public watch(): void {
    const $subscribed = zoneChangesSubject.subscribe(({ newZone, cardIds }) => {
      if (newZone === ZoneType.battlefield && cardIds.some((id) => id === this.getMeta().baseCard.cardId)) {
        this.effect.do({ cardIds });
        $subscribed.unsubscribe();
      }
    });
  }
}
