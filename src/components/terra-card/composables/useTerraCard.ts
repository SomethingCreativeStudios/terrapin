import { computed, Ref, ref } from 'vue';
import { useEvents, useDraggable, DraggableEvents, ContainerEvents, useZone, CardBusEventName } from '~/composables';
import { Card, CardPosition } from '~/models/card.model';
import { EventEmitter } from '~/models/event-emitter.model';
import { DisplayType } from '~/models/zone.model';

function buildClasses(cardState: Ref<string>, displayType: DisplayType) {
  return computed(() => ({
    'terra-card': true,
    [`terra-card__${cardState.value}`]: true,
    'terra-card--relative': displayType === DisplayType.SORTABLE,
    draggable: true,
  }));
}

function setUpDragEvents(cardId: string, position: Ref<CardPosition>, dragEvents: EventEmitter, draggable: Ref<null>, cardState: Ref<string>, displayType: DisplayType) {
  const { emitEvent, onEvent } = useEvents();
  const isSelected = () => draggable.value && (draggable.value as HTMLElement).classList.contains('selected');

  dragEvents.listen(DraggableEvents.ON_POSITION_MOVE, ({ offset }: { offset: CardPosition }) => {
    if (!draggable.value) return;
    if (!isSelected()) return;

    // Send global position move event
    // Will probably need to add zone guard as well
    emitEvent(DraggableEvents.ON_POSITION_MOVE, { offset, senderId: cardId });
  });

  onEvent(DraggableEvents.ON_POSITION_MOVE, ({ offset, senderId }: { offset: CardPosition; senderId: string }) => {
    if (!draggable.value) return;
    if (cardId === senderId) return;
    if (!isSelected()) return;

    position.value.x += offset.x;
    position.value.y += offset.y;

    (draggable.value as HTMLElement).style.transform = `translate(${position.value.x}px, ${position.value.y}px)`;
  });

  onEvent(CardBusEventName.POSITION_UPDATE, ({ pos, cardId: senderId, zIndex }: { pos: CardPosition; cardId: string; zIndex?: 0 }) => {
    if (!draggable.value) return;
    if (cardId !== senderId) return;
    if (!isSelected()) return;

    position.value.x = pos.x;
    position.value.y = pos.y;

    if (zIndex) {
      // @ts-ignore
      (draggable.value as HTMLElement).style['z-index'] = zIndex;
    }
    (draggable.value as HTMLElement).style.transform = `translate(${position.value.x}px, ${position.value.y}px)`;
  });

  onEvent(CardBusEventName.TOGGLE_TAP_CARD, () => {
    if (!isSelected()) return;

    onTap(cardState, displayType);
  });
}

function onTap(cardState: Ref<string>, displayType: DisplayType) {
  if (displayType === DisplayType.SORTABLE) return;

  if (cardState.value === 'tapped') {
    cardState.value = 'untapped';
  } else {
    cardState.value = 'tapped';
  }
}

function onCardClick(e: any, card: Card, displayType: DisplayType) {
  if (displayType === DisplayType.SORTABLE) return;

  const { emitEvent } = useEvents();
  const { findZoneFromCard } = useZone();

  emitEvent(ContainerEvents.SELECT_ELEMENT, { name: findZoneFromCard(card), el: e.target });
}

export function setUpCard(card: Card, displayType: DisplayType) {
  const { setup: setUpDrag } = useDraggable();
  const { draggable, position, draggableEvents } = setUpDrag(card.position);

  const cardState = ref('initial');

  setUpDragEvents(card.cardId, position, draggableEvents, draggable, cardState, displayType);

  return { draggable, cardClass: buildClasses(cardState, displayType), onTap: () => onTap(cardState, displayType), onCardClick: (e: any) => onCardClick(e, card, displayType) };
}
