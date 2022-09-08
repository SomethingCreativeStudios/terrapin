import { useZone, useDeck, useDialog } from '~/composables';
import { Card } from '~/models/card.model';
import { ZoneType } from '~/models/zone.model';
import * as DeckActions from './deck.action';


export function shuffleHandIntoDeck() {
    const { getCardsInZone, moveCard } = useZone();

    const cardsInHand = getCardsInZone(ZoneType.hand);
    cardsInHand.value.forEach(card => moveCard(ZoneType.hand, ZoneType.deck, card));

    DeckActions.shuffleDeck();
}

/**
 * Draw till hand limit
 */
export function drawHand() {
    const { drawXCards } = useDeck();
    drawXCards(7);
}

export function sendToBottom(cards: Card[]) {
    const { moveCard } = useZone();

    cards.forEach((card) => {
        moveCard(ZoneType.hand, ZoneType.deck, card, true);
    });
}

export function randomlyDiscard(numberOfTimes = 1) {
    if (numberOfTimes === 0) {
        return;
    }

    const { getCardsInZone, moveCard } = useZone();
    const cardsInHand = getCardsInZone(ZoneType.hand);

    const indexToDiscard = Math.floor(Math.random() * (cardsInHand.value?.length - 1));
    moveCard(ZoneType.hand, ZoneType.graveyard, cardsInHand.value[indexToDiscard]);

    randomlyDiscard(numberOfTimes - 1);
}