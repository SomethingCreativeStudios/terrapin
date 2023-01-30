import { Card } from '~/models/card.model';
import { CardCost } from '../effect';
import { useGameState, useZone } from '~/composables';
import { ZoneType } from '~/models/zone.model';

const { getZones } = useZone();

export class AffinityCost extends CardCost {
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

    const type = this.getMeta().baseCard.manaCost.mana.find((mana) => mana.genericCost > 0);
    this.label = `Cast: ${(type?.genericCost ?? 0) - numberOfArtifacts.length}`;

    return true;
  }

  pay(): void {}
}
