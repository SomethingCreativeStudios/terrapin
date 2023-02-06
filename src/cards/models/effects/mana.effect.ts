import { TrackerActions } from '~/actions';
import { useDialog } from '~/composables';
import { Card, ManaType } from '~/models/card.model';
import { DialogChoice } from '~/models/dialog.model';
import { Effect } from './effect';

export class ManaEffect extends Effect {
  constructor(card: Card, private amount = 1) {
    super(card);
  }

  async do(): Promise<void> {
    const { askQuestion } = useDialog();
    const toChoice = (manaType: ManaType) => ({ label: manaType, value: manaType } as DialogChoice<ManaType>);

    const manaColor = await askQuestion<ManaType>('Pick Mana Type', [ManaType.WHITE, ManaType.BLUE, ManaType.BLACK, ManaType.RED, ManaType.GREEN].map(toChoice));

    TrackerActions.addMana(manaColor.value, this.amount);
  }
}
