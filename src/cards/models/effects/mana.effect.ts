import { TrackerActions } from '~/actions';
import { useDialog } from '~/composables';
import { Card, ManaType } from '~/models/card.model';
import { Effect } from './effect';

export class ManaEffect extends Effect {
  constructor(card: Card, private amount = 1) {
    super(card);
  }

  async do(): Promise<void> {
    const { askQuestion } = useDialog();

    const manaColor = await askQuestion('Pick Mana Type', [ManaType.WHITE, ManaType.BLUE, ManaType.BLACK, ManaType.RED, ManaType.GREEN]);

    TrackerActions.addMana(manaColor as ManaType, this.amount);
  }
}
