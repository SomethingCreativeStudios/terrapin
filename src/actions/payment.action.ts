import { computed } from 'vue';
import { useDialog, useMana } from '~/composables';
import { ManaCost, ManaType } from '~/models/card.model';
import { DialogChoice } from '~/models/dialog.model';
import { TrackerActions } from '.';
import { manaPipToString, meetsPip } from './helper/mana-cost.helper';

export async function wasPaid(manaCost: ManaCost): Promise<boolean> {
  const { askComplexQuestion, toChoice } = useDialog();
  const choices = [] as boolean[];
  const { getSpentMana } = useMana();

  if (manaCost.mana.length === 1 && manaCost.mana[0].types?.length === 0 && manaCost.mana[0].genericCost === 0) {
    return true;
  }

  const promisedChoices = [] as Promise<DialogChoice<string>>[];
  for (const manaPip of manaCost.mana) {
    // if free,
    if (manaPip.genericCost <= 0 && manaPip.types.length === 0) {
      continue;
    }

    const question = () =>
      computed(() => {
        if (manaPip.genericCost) {
          const used = getSpentMana().value;
          const total = Object.values(used).reduce((acc, count) => acc + count, 0);
          const leftToPay = manaPip.genericCost - total;
          return leftToPay ? `Pay Mana? ${manaPipToString({ ...manaPip, genericCost: leftToPay })}` : 'Spend This Mana?';
        }
        return `Pay Mana? ${manaPipToString(manaPip)}`;
      });

    const choice = askComplexQuestion(
      question,
      toChoice(['Done', 'Cancel']),
      {
        Done: () =>
          computed(() => {
            const used = getSpentMana().value;
            const total = Object.values(used).reduce((acc, count) => acc + count, 0);
            console.log(total);
            return !meetsPip(used, manaPip);
          }),
      },
      true,
      (choice) => {
        spendMana(getSpentMana().value);
        TrackerActions.clearUsedMana();
      }
    ) as Promise<DialogChoice<string>>;

    promisedChoices.push(choice);
  }

  for await (const choice of promisedChoices) {
    const foundChoice = await choice;

    if (foundChoice.value === 'Cancel') {
      const { resetMana } = useMana();
      resetMana();
      return false;
    }

    choices.push(choice.value === 'Done');
  }

  return choices.every(Boolean);
}

function spendMana(mana: Record<ManaType, number>) {
  Object.entries(mana).forEach(([manaType, number]) => TrackerActions.useMana(manaType as ManaType, number));
}
