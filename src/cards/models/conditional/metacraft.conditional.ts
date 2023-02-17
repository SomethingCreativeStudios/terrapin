import { useGameItems, useZone } from '~/composables';
import { ZoneType } from '~/models/zone.model';
import { Conditional } from './conditional';

export class MetalcraftConditional implements Conditional {
  canMeet(): boolean {
    const { getZones } = useZone();
    const { getCardById } = useGameItems();
    const battlefield = getZones().value[ZoneType.battlefield];
    const numberOfArtifacts = battlefield.cardIds.filter((id) => {
      const card = getCardById(id).value;

      return card.baseCard.cardTypes.includes('Artifact');
    });

    return numberOfArtifacts.length > 2;
  }
}
