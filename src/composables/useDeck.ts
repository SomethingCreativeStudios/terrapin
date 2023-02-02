import { computed, reactive } from 'vue';
import { useTauri } from './useTauri';
import { useZone } from './useZone';
import { useGameState } from './useGameState';
import { ZoneType } from '~/models/zone.model';
import { DeckActions } from '~/actions';
import { cards as cardClassMap } from '~/cards/cards';
import { BaseCard } from '~/cards/base.card';
import { startMulligan } from '~/states/mulligan.state';

const { addCardToZone } = useZone();
const { setMeta } = useGameState();

const state = reactive({ deck: [] as string[] });

// @ts-ignore
window.state.deck = state;

async function loadDeck(deckName: string) {
  const { loadDeck: loadTauriDeck } = useTauri();

  const cards = await loadTauriDeck(deckName);

  cards.forEach((card) => {
    const CardClass = cardClassMap[card.oracleId] as BaseCard;

    setMeta(card.cardId, { baseCard: card });

    // @ts-ignore
    setMeta(card.cardId, { cardClass: CardClass ? new CardClass(card) : new BaseCard(card) });
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
