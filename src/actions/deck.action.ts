import { curry } from 'ramda';
import { useZone, useDeck } from '~/composables';
import { ZoneType } from '~/models/zone.model';

const shuffler = curry((random: any, list: any[]) => {
  let idx = -1;
  let position;
  let result = [] as any[];
  while (++idx < list.length) {
    position = Math.floor((idx + 1) * random());
    result[idx] = result[position];
    result[position] = list[idx];
  }
  return result;
});

const shuffle = shuffler(Math.random);

export function millXCards(x: number) {
  const { getCardsInZone, moveCard } = useZone();
  const deck = getCardsInZone(ZoneType.deck);
  const cards = deck.value.slice(0, x);
  cards.forEach((card) => moveCard(ZoneType.deck, ZoneType.graveyard, card));
}

export function shuffleDeck() {
  const { getCardsInZone, setCardsInZone } = useZone();

  setCardsInZone(ZoneType.deck, shuffle(getCardsInZone(ZoneType.deck).value));
}

export function DrawXCards(x: number) {
  const { drawXCards } = useDeck();
  drawXCards(x);
}
