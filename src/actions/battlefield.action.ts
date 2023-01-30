import { useCard, useZone } from "~/composables"
import { ZoneType } from "~/models/zone.model";

export function untapAll() {
    const { getCardsInZone } = useZone();
    const { tapOrUntapCard } = useCard();
    const cards = getCardsInZone(ZoneType.battlefield);
    tapOrUntapCard(cards.value, false);
}

export function tapAll() {
    const { getCardsInZone } = useZone();
    const { tapOrUntapCard } = useCard();
    const cards = getCardsInZone(ZoneType.battlefield);
    tapOrUntapCard(cards.value, true);
}