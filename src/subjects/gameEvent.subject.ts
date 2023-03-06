import { async, Subject } from 'rxjs';
import { Ability, AbilityType, TimingRule } from '~/cards/models/abilities/ability';
import { StaticAbility } from '~/cards/models/abilities/static-ability';
import { EventType } from '~/cards/models/game-event';
import { useGameItems } from '~/composables';
import { CardState } from '~/models/card.model';
import { ZoneType } from '~/models/zone.model';

export interface GameEvent {
  type: EventType;
  sourceId: string;
  sourceZone: ZoneType;
}

const eventSubject = new Subject<{ type: EventType; sourceId: string; sourceZone: ZoneType }>();

eventSubject.subscribe(async ({ sourceId, type, sourceZone }: GameEvent) => {
  const { getAllCards, processDuration, cleanUpEffects } = useGameItems();
  const allCards = getAllCards().value;

  for await (const cardState of allCards) {
    if (cardState.zone === sourceZone) {
      for await (const ability of cardState.cardClass.abilities) {
        await handleAbilityActs(cardState, ability, sourceZone);
      }
    }
  }

  await processDuration(type);
  cleanUpEffects();
});

export { eventSubject };

async function handleAbilityActs(card: CardState, ability: Ability, sourceZone: ZoneType) {
  if (ability.type === AbilityType.TRIGGERED && ability.validZones.includes(sourceZone)) {
    (await ability.canDo()) && (await ability.do());
  }
}
