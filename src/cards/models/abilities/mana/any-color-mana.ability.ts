import { ManaActions } from '~/actions';
import { useMana } from '~/composables';
import { ManaType } from '~/models/card.model';
import { ZoneType } from '~/models/zone.model';
import { Cost } from '../../costs';
import { ManaEffect } from '../../effects';
import { ActivatedManaAbility } from './activated-mana.ability';

export class AnyColorManaAbility extends ActivatedManaAbility {
  constructor(cardId: string, costs: Cost[], zones = [ZoneType.battlefield]) {
    super(cardId, costs, zones);
  }

  async ability(): Promise<void> {
    const { addFloatingMana } = useMana();
    addFloatingMana(await ManaActions.pickManaColor(), 1);
  }
}
