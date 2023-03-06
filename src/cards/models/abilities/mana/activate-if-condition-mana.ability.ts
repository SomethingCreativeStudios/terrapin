import { ManaActions } from '~/actions';
import { useMana } from '~/composables';
import { ZoneType } from '~/models/zone.model';
import { Condition } from '../../condition';
import { Cost } from '../../costs';
import { ActivatedManaAbility } from './activated-mana.ability';

export class ActivateIfConditionManaAbility extends ActivatedManaAbility {
  constructor(cardId: string, costs: Cost[], condition: Condition, zones = [ZoneType.battlefield]) {
    super(cardId, costs, zones);

    this.condition = condition;
  }

  async ability(): Promise<void> {
    if (this.condition === null) return;

    const meets = await this.condition.meets(this);

    if (!meets) return;

    const { addFloatingMana } = useMana();
    addFloatingMana(await ManaActions.pickManaColor(), 1);
  }
}
