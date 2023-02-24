import { computed } from 'vue';
import { CardType } from '~/cards/base.card';
import { useZone } from '~/composables';
import { CardTypeFilter } from '~/filters/card.filter';
import { ZoneType } from '~/models/zone.model';

export function getArtifactCount() {
  const { getCardsInZoneByFilter } = useZone();

  return computed(() => getCardsInZoneByFilter(ZoneType.battlefield, new CardTypeFilter([CardType.ARTIFICAT]))?.length ?? 0);
}
