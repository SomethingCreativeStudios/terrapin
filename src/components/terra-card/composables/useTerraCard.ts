import { emit } from 'process';
import { computed, Ref, ref } from 'vue';
import { useEvents, useDraggable, DraggableEvents, ContainerBusEvents, useZone, CardBusEventName } from '~/composables';
import { Card, CardPosition } from '~/models/card.model';
import { EventEmitter } from '~/models/event-emitter.model';
import { ContainerType } from '~/models/zone.model';

function buildClasses(cardState: Ref<string>, containerType: ContainerType) {
  return computed(() => ({
    'terra-card': true,
    [`terra-card__${cardState.value}`]: true,
    'terra-card--relative': containerType === ContainerType.SORTABLE,
    'terra-card--dialog': containerType === ContainerType.CARD_DIALOG,
    draggable: true,
  }));
}

function setUpDragEvents(cardId: string, position: Ref<CardPosition>, dragEvents: EventEmitter, draggable: Ref<null>, cardState: Ref<string>, containerType: ContainerType) {
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

    onTap(cardState, containerType);
  });
}

function onTap(cardState: Ref<string>, containerType: ContainerType) {
  if (containerType !== ContainerType.FREE_POSITION) return;

  if (cardState.value === 'tapped') {
    cardState.value = 'untapped';
  } else {
    cardState.value = 'tapped';
  }
}

function onCardClick(e: any, card: Card, containerType: ContainerType) {
  if (containerType === ContainerType.SORTABLE) return;

  const { emitEvent } = useEvents();
  const { findZoneNameFromCard } = useZone();

  emitEvent(ContainerBusEvents.SELECT_ELEMENT, { name: findZoneNameFromCard(card), el: e.target });
}

function onCardHover(e: MouseEvent, card: Card, containerType: ContainerType, ctx: any) {
  if (containerType !== ContainerType.CARD_DIALOG) return;
  const els = document.elementsFromPoint(e.x, e.y);
  const box = els[0]?.getBoundingClientRect();

  ctx.emit("cardHover", { pos: { x: box.x, y: box.y }, card } as { pos: CardPosition, card: Card });
}

export function setUpCard(card: Card, containerType: ContainerType, ctx: any) {
  const { setup: setUpDrag } = useDraggable();
  const { draggable, position, draggableEvents } = setUpDrag(card.position);

  const cardState = ref('initial');

  setUpDragEvents(card.cardId, position, draggableEvents, draggable, cardState, containerType);

  return {
    draggable,
    cardClass: buildClasses(cardState, containerType),
    onTap: () => onTap(cardState, containerType),
    onCardClick: (e: any) => onCardClick(e, card, containerType),
    onCardHover: (e: any) => onCardHover(e, card, containerType, ctx),
  };
}
