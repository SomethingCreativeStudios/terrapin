import { computed, reactive } from 'vue';
import { useTauri } from './useTauri';
import { useZone } from './useZone';
import { useGameItems } from './useGameItems';
import { ZoneType } from '~/models/zone.model';
import { DeckActions } from '~/actions';
import { BaseCard } from '~/cards/models/base.card';
import { startMulligan } from '~/states/mulligan.state';

const { addCardToZone } = useZone();
const { addCardToMap } = useGameItems();

const state = reactive({ deck: [] as string[] });

// @ts-ignore
window.state.deck = state;

async function loadDeck(deckName: string) {
  const { loadDeck: loadTauriDeck } = useTauri();

  const cards = await loadTauriDeck(deckName);

  cards.forEach((card) => {
    addCardToMap(card);
  });

  state.deck = cards.map((card) => card.cardId);
  state.deck.forEach((card) => addCardToZone(ZoneType.deck, card));

  DeckActions.shuffleDeck();

  startMulligan();
}

function getDeck() {
  return computed(() => state.deck);
}

function drawXCards(x: number) {
  const { moveCard, getCardsInZone } = useZone();
  const cards = getCardsInZone(ZoneType.deck);
  const xCards = cards.value.slice(0, x);

  xCards.forEach((card) => moveCard(ZoneType.deck, ZoneType.hand, card));
}

export function useDeck() {
  return { loadDeck, getDeck, drawXCards };
}
