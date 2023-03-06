import { ZoneType } from '~/models/zone.model';
import { Effect } from '../effects';
import { EventType } from '../game-event';
import { Duration } from '../other-constants';
import { TriggeredAbility } from './triggered.ability';

export abstract class DelayedTriggeredAbility extends TriggeredAbility {
  private duration = Duration.END_OF_COMBAT;
  private triggerOnlyOnce = true;

  constructor(cardId: string, effects: Effect[], duration: Duration, triggerOnlyOnce = true) {
    super(cardId, effects, [ZoneType.none]);
    this.duration = duration;
    this.triggerOnlyOnce = triggerOnlyOnce;
  }

  public abstract meetsGameEvent(eventType: EventType): boolean;

  public getDuration() {
    return this.duration;
  }
}
