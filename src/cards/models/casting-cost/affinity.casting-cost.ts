import { useZone, useGameState } from '~/composables';
import { Card, ManaType } from '~/models/card.model';
import { ZoneType } from '~/models/zone.model';
import { castSpell } from '~/states';
import { CastingCost } from './casting-cost';
import { clone } from 'ramda';

export class AffinityCastingCost extends CastingCost {
  constructor(card: Card, label: string, private cardType = 'Artifact', validZones = [ZoneType.hand]) {
    super(card, label, validZones);
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
      castSpell(this.getMeta().baseCard, { cardPos: this.getMeta().position, skipAuto: true });
      return;
    }

    const cloned = clone(this.getMeta());
    const found = cloned.baseCard.manaCost.mana.find((mana) => mana.genericCost > 0) || { genericCost: 0, types: [] };

    found.genericCost -= numberOfArtifacts;

    castSpell(cloned.baseCard, { cardPos: this.getMeta().position, skipAuto: true });
  }
}
