import { Card, CardPosition } from '~/models/card.model';
import { ZoneType } from '~/models/zone.model';
import { castSpell } from '~/states';
import { CastingCost } from './casting-cost';

export class DefaultCastingCost extends CastingCost {
  constructor(card: Card, private position: CardPosition, label: string, validZones = [ZoneType.hand]) {
    super(card, label, validZones);
  }

  canCast(): boolean {
    return true;
  }

  cast(): void {
    castSpell(this.getMeta().baseCard, { cardPos: this.position, skipAuto: true });
  }
}
