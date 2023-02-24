import { ZoneType } from '~/models/zone.model';
import { Effect } from '../effects/effect';
import { Ability, AbilityType } from './ability';
import { EventType } from '../game-event';
import { eventSubject } from '~/subjects';
import { useGameTracker } from '~/composables';

export class TriggeredAbility extends Ability {
  public isOptional = false;
  public isLeavesTrigger = false;
  public eventType = EventType.ENTERS_THE_BATTLEFIELD;

  constructor(cardId: string, effects: Effect[], zones: ZoneType[]) {
    super(cardId, [], effects, AbilityType.TRIGGERED, zones);
  }

  async canDo(): Promise<boolean> {
    const { getEventType } = useGameTracker();

    return (await this.defaultCanDo()) && getEventType().value === this.eventType;
  }

  async ability(): Promise<void> {
    await this.doEffects();
  }
}
