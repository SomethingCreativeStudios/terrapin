import { Card } from '~/models/card.model';
import { Effect } from '../effects/effect';
import { Watcher } from './watcher';
import { phaseSubject } from '~/subjects';
import { PhaseType, TurnPhase } from '~/models/phases.model';

export class UpkeepWatcher extends Watcher {
  constructor(card: Card, effects: Effect[], private isOneOff = false) {
    super(card, effects);
  }

  public watch(): void {
    const $subscribed = phaseSubject.subscribe(({ type, phase }) => {
      if (phase === TurnPhase.UPKEEP && type === PhaseType.START) {
        this.effects.forEach((effect) => effect.do());

        if (this.isOneOff) {
          $subscribed.unsubscribe();
        }
      }
    });
  }
}
