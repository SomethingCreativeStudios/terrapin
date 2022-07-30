import { computed, reactive } from 'vue';
import { debounce } from 'debounce';
import { Card, CardPosition } from '~/models/card.model';
import { useEvents } from '~/composables/useEvents';
import { useZone } from './useZone';

const { onEvent, emitEvent } = useEvents();
const { findZoneFromCard } = useZone();

export enum CardBusEventName {
  POSITION_OFFSET_UPDATE = 'position-offset-update',
  POSITION_UPDATE = 'position-update',
  TOGGLE_TAP_CARD = 'toggle-tap-card',
  STACK_CARDS = 'stack-card',
  LINE_CARDS = 'line-card',
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
  document.onmousemove = debounce((ev: any) => {
    const els = document.elementsFromPoint(ev.x, ev.y);
    const card = els.find((el) => el.classList.contains('terra-card'));

    if (card) {
      // @ts-ignore
      const zone = findZoneFromCard(card.__vue__.card);

      if (!zone.disableHover) {
        // @ts-ignore
        state.hoveredCard = card.__vue__.card;
      }
    }
  }, 500);

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
  emitEvent(CardBusEventName.POSITION_OFFSET_UPDATE, { ids, position } as CardPositionEvent);
}

function onPositionUpdate(cardId: string, cb: (position: CardPosition) => void) {
  onEvent(CardBusEventName.POSITION_OFFSET_UPDATE, (data: CardPositionEvent) => {
    if (data.ids.includes(cardId)) {
      cb(data.position);
    }
  });
}
export function useCard() {
  return { setUp, getHoveredCard, onPositionUpdate, updatePosition, setUpHoverEvents };
}
