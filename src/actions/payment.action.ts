import { computed } from 'vue';
import { useDialog, useGameState } from '~/composables';
import { ManaCost, ManaType } from '~/models/card.model';
import { DialogChoice } from '~/models/dialog.model';
import { TrackerActions } from '.';
import { manaPipToString, meetsPip } from './helper/mana-cost.helper';

export async function wasPaid(manaCost: ManaCost): Promise<boolean> {
  const { askComplexQuestion, toChoice } = useDialog();
  const choices = [] as boolean[];
  const { getFloatingMana } = useGameState();
  const tempFloating = { ...getFloatingMana().value };

  if (manaCost.mana.length === 1 && manaCost.mana[0].types?.length === 0 && manaCost.mana[0].genericCost === 0) {
    return true;
  }

  for await (const manaPip of manaCost.mana) {
    if (manaPip.genericCost <= 0 && manaPip.types.length === 0) {
      continue;
    }

    const question = () =>
      computed(() => {
        if (manaPip.genericCost) {
          const { getUsedMana } = useGameState();
          const used = getUsedMana().value;
          const total = Object.values(used).reduce((acc, count) => acc + count, 0);
          const leftToPay = manaPip.genericCost - total;
          return leftToPay ? `Pay Mana? ${manaPipToString({ ...manaPip, genericCost: leftToPay })}` : 'Spend This Mana?';
        }
        return `Pay Mana? ${manaPipToString(manaPip)}`;
      });

    const choice = (await askComplexQuestion(
      question,
      toChoice(['Done', 'Cancel']),
      {
        Done: () =>
          computed(() => {
            const { getUsedMana } = useGameState();
            const used = getUsedMana().value;
            const total = Object.values(used).reduce((acc, count) => acc + count, 0);
            console.log(total);
            return !meetsPip(used, manaPip);
          }),
      },
      true
    )) as DialogChoice<string>;

    if (choice.value === 'Cancel') {
      const { setFloatingMana } = useGameState();
      setFloatingMana(tempFloating);
      return false;
    }

    const { getUsedMana } = useGameState();
    useMana(getUsedMana().value);
    TrackerActions.clearUsedMana();

    choices.push(choice.value === 'Done');
  }

  return choices.every(Boolean);
}

function useMana(mana: Record<ManaType, number>) {
  Object.entries(mana).forEach(([manaType, number]) => TrackerActions.useMana(manaType as ManaType, number));
}
