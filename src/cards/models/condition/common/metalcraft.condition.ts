import { useZone, useGameItems } from '~/composables';
import { ZoneType } from '~/models/zone.model';
import { Ability } from '../../abilities';
import { Condition } from '../condition';

export class MetalcraftCondition extends Condition {
  public async meets(source: Ability): Promise<boolean> {
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
