import { computed, reactive } from 'vue';
import { Card, CardPosition } from '~/models/card.model';
import { useEvents } from '~/composables/useEvents';

const { onEvent, emitEvent } = useEvents();
export enum CardBusEventName {
  POSITION_UPDATE = 'position-update',
}
export interface CardPositionEvent {
  ids: string[];
  position: CardPosition;
}

const state = reactive({ hoveredCard: {} as Card });

// @ts-ignore
window.state.card = state;

function setUp() {}

function setUpHoverEvents() {
  document.onmousemove = (ev) => {
    const els = document.elementsFromPoint(ev.x, ev.y);
    const card = els.find((el) => el.classList.contains('terra-card'));

    if (card) {
      // @ts-ignore
      state.hoveredCard = card.__vue__.card;
    }
  };

  document.ondblclick = (ev) => {
    const els = document.elementsFromPoint(ev.x, ev.y);
    const card = els.find((el) => el.classList.contains('terra-card'));

    if (!card) {
      state.hoveredCard = {} as Card;
    }
  };
}

function getHoveredCard() {
  return computed(() => state.hoveredCard);
}

function updatePosition(ids: string[], position: CardPosition) {
  emitEvent(CardBusEventName.POSITION_UPDATE, { ids, position } as CardPositionEvent);
}

function onPositionUpdate(cardId: string, cb: (position: CardPosition) => void) {
  onEvent(CardBusEventName.POSITION_UPDATE, (data: CardPositionEvent) => {
    if (data.ids.includes(cardId)) {
      cb(data.position);
    }
  });
}
export function useCard() {
  return { setUp, getHoveredCard, onPositionUpdate, updatePosition, setUpHoverEvents };
}
