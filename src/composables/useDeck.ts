import { computed, reactive } from 'vue';
import { useTauri } from './useTauri';
import { useZone } from './useZone';
import { Card } from '~/models/card.model';
import { ZoneType } from '~/models/zone.model';
import { DeckActions } from '~/actions';

const { addCardToZone } = useZone();
const state = reactive({ deck: [] as Card[] });

// @ts-ignore
window.state.deck = state;

async function loadDeck(deckName: string) {
  const { loadDeck: loadTauriDeck } = useTauri();

  state.deck = await loadTauriDeck(deckName);
  state.deck.forEach((card) => addCardToZone(ZoneType.deck, card));

  DeckActions.shuffleDeck();
}

function getDeck() {
  return computed(() => state.deck);
}

function setDeck(deck: Card[]) {
  state.deck = deck;
}

function drawXCards(x: number) {
  const { moveCard, getCardsInZone } = useZone();
  const cards = getCardsInZone(ZoneType.deck);
  const xCards = cards.value.slice(0, x);

  xCards.forEach((card) => moveCard(ZoneType.deck, ZoneType.hand, card));
}



export function useDeck() {
  return { loadDeck, getDeck, drawXCards, setDeck };
}
