import { useZone, useGameState } from '~/composables';
import { Card, ManaType } from '~/models/card.model';
import { ZoneType } from '~/models/zone.model';
import { castSpell } from '~/states';
import { CastingCost } from './casting-cost';

export class AffinityCastingCost extends CastingCost {
  constructor(card: Card, label: string, private cardType = 'Artifact') {
    super(card, label);
  }

  canCast(): boolean {
    return true;
  }

  cast(): void {
    const { getZones } = useZone();
    const { getMeta } = useGameState();
    const battlefield = getZones().value[ZoneType.battlefield];
    const numberOfArtifacts = battlefield.cardIds.filter((id) => {
      const card = getMeta(id).value;

      return card.baseCard.cardTypes.includes(this.cardType);
    }).length;

    if (numberOfArtifacts === 0) {
      castSpell(this.getMeta().baseCard);
      return;
    }

    const found = this.getMeta().baseCard.manaCost.mana.find((mana) => mana.genericCost > 0) || { genericCost: 0, types: [] };

    found.genericCost -= numberOfArtifacts;

    castSpell(this.getMeta().baseCard);
  }
}