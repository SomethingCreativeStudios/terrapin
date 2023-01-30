import { Card } from '~/models/card.model';
import { CardCost } from '../effect';
import { useGameState, useZone } from '~/composables';
import { ZoneType } from '~/models/zone.model';

const { getZones } = useZone();

export class MetalcraftCost extends CardCost {
  constructor(card: Card) {
    super(card);
  }

  meetsRequirements(): boolean {
    const { getMeta } = useGameState();
    const battlefield = getZones().value[ZoneType.battlefield];
    const numberOfArtifacts = battlefield.cardIds.filter((id) => {
      const card = getMeta(id).value;

      return card.baseCard.cardTypes.includes('Artifact');
    });

    return numberOfArtifacts.length > 2;
  }

  pay(): void {}
}
