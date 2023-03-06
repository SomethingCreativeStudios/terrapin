import { useDialog } from '~/composables';
import { ManaType } from '~/models/card.model';

export async function pickManaColor() {
  const { askQuestion, toChoice } = useDialog();
  const mana = await askQuestion<ManaType>('Pick mana', toChoice([ManaType.WHITE, ManaType.BLUE, ManaType.BLACK, ManaType.RED, ManaType.GREEN]));
  return mana.value;
}
