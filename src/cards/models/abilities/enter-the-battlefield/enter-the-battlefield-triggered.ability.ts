import { useGameTracker } from '~/composables';
import { ZoneType } from '~/models/zone.model';
import { Effect } from '../../effects/effect';
import { EventType } from '../../game-event';
import { TriggeredAbility } from '../triggered.ability';

export class EnterTheBattlefieldTriggeredAbility extends TriggeredAbility {
  constructor(cardId: string, effects: Effect[]) {
    super(cardId, effects, [ZoneType.battlefield]);
    this.eventType = EventType.ENTERS_THE_BATTLEFIELD;
  }

  override async canDo(): Promise<boolean> {
    const { getEventType } = useGameTracker();
    const event = getEventType().value;

    return event.type === EventType.ENTERS_THE_BATTLEFIELD && event.sourceId === this.cardId && (await this.defaultCanDo());
  }
}
