import { Card, ManaType } from '~/models/card.model';
import { CardCost } from '../effect';
import { useDialog, useZone } from '~/composables';
import { TrackerActions } from '~/actions';

const { getZones } = useZone();

export class AddManaCost extends CardCost {
  constructor(card: Card) {
    super(card);
  }

  meetsRequirements(): boolean {
    return true;
  }

  async pay(): Promise<void> {
    const { askQuestion } = useDialog();

    const manaColor = await askQuestion('Pick Mana Type', [ManaType.WHITE, ManaType.BLUE, ManaType.BLACK, ManaType.RED, ManaType.GREEN]);

    TrackerActions.addMana(manaColor as ManaType, 1);
  }
}
