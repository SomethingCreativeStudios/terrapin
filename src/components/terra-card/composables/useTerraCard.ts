import { computed, Ref, ref } from 'vue';
import { useEvents, useDraggable, DraggableEvents, ContainerEvents, useZone } from '~/composables';
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

function setUpDragEvents(cardId: string, position: Ref<CardPosition>, dragEvents: EventEmitter, draggable: Ref<null>) {
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
}

function onTap(cardState: Ref<string>) {
  if (cardState.value === 'tapped') {
    cardState.value = 'untapped';
  } else {
    cardState.value = 'tapped';
  }
}

function onCardClick(e: any, card: Card) {
  const { emitEvent } = useEvents();
  const { findZoneFromCard } = useZone();

  emitEvent(ContainerEvents.SELECT_ELEMENT, { name: findZoneFromCard(card), el: e.target });
}

export function setUpCard(card: Card, displayType: DisplayType) {
  const { setup: setUpDrag } = useDraggable();
  const { draggable, position, draggableEvents } = setUpDrag(card.position);

  const cardState = ref('initial');

  setUpDragEvents(card.cardId, position, draggableEvents, draggable);

  return { draggable, cardClass: buildClasses(cardState, displayType), onTap: () => onTap(cardState), onCardClick: (e: any) => onCardClick(e, card) };
}
