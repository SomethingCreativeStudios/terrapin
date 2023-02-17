import { computed, reactive } from 'vue';
import { debounce } from 'debounce';
import { Card, CardPosition } from '~/models/card.model';
import { useEvents, useTauri, useZone, useGameItems } from '~/composables';

const { onEvent, emitEvent } = useEvents();
const { findZoneFromCard } = useZone();
const { getCardById, setCardsByIds } = useGameItems();

export enum CardBusEventName {
  POSITION_OFFSET_UPDATE = 'position-offset-update',
  POSITION_UPDATE = 'position-update',
  TOGGLE_TAP_CARD = 'toggle-tap-card',
  TAP_CARD = 'tap-card',
  UNTAP_CARD = 'untap-card',
  STACK_CARDS = 'stack-card',
  LINE_CARDS = 'line-card',
  TARGET_CARD = 'target-card',
  UNTARGET_CARD = 'untarget-card',
}
export interface CardPositionEvent {
  ids: string[];
  position: CardPosition;
}

const state = reactive({ hoveredCard: '', tokens: [] as Card[] });

// @ts-ignore
window.state.card = state;

async function setUp() {
  const { loadTokens } = useTauri();
  state.tokens = await loadTokens();

  setUpHoverEvents();
}

function setUpHoverEvents() {
  document.onmousemove = debounce((ev: any) => {
    const els = document.elementsFromPoint(ev.x, ev.y);
    const card = els.find((el) => el.classList.contains('terra-card'));

    if (card) {
      // @ts-ignore
      const zone = findZoneFromCard(card.__vue__.card.cardId);

      if (!zone.disableHover) {
        // @ts-ignore
        state.hoveredCard = card.__vue__.card?.cardId;
      }
    } else if (state.hoveredCard) {
      clearHoveredCard();
    }
  }, 250);

  document.ondblclick = (ev) => {
    const els = document.elementsFromPoint(ev.x, ev.y);
    const card = els.find((el) => el.classList.contains('terra-card'));

    if (!card) {
      clearHoveredCard();
    }
  };
}

function getHoveredCard() {
  return computed(() => getCardById(state.hoveredCard).value?.baseCard);
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

function tapOrUntapCard(ids: string[], tap = true) {
  if (tap) {
    emitEvent(CardBusEventName.TAP_CARD, { ids });
    setCardsByIds(ids, { isTapped: true });
  } else {
    emitEvent(CardBusEventName.UNTAP_CARD, { ids });
    setCardsByIds(ids, { isTapped: false });
  }
}

function clearHoveredCard() {
  state.hoveredCard = '';
}
export function useCard() {
  return { setUp, getHoveredCard, tapOrUntapCard, onPositionUpdate, updatePosition, setUpHoverEvents };
}
