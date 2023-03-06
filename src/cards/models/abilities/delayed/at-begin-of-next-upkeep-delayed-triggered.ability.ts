import { EventType } from '../../game-event';
import { DelayedTriggeredAbility } from '../delayed-triggered.ability';

export class AtBeginOfNextUpkeepDelayedTriggeredAbility extends DelayedTriggeredAbility {
  public meetsGameEvent(eventType: EventType): boolean {
    return eventType === EventType.UPKEEP_STEP_PRE;
  }
}
