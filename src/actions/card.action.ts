import { Card } from '~/models/card.model';
import { useZone } from '~/composables';
import { ZoneType } from '~/models/zone.model';

export function sacrifice(card: Card) {
  const { moveCard } = useZone();

  moveCard(ZoneType.battlefield, ZoneType.graveyard, card.cardId);
}
