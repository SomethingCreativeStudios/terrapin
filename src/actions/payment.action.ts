import { computed } from 'vue';
import { AbilityType } from '~/cards/models/abilities/ability';
import { useDialog, useGameItems, useMana } from '~/composables';
import { ManaType } from '~/models/card.model';
import { DialogChoice } from '~/models/dialog.model';
import { ZoneType } from '~/models/zone.model';
import { TrackerActions } from '.';
import { manaPipToString, meetsPip } from './helper/mana-cost.helper';

const { getCardById } = useGameItems();

async function applyManaCostMods(cardId: string) {
  const state = getCardById(cardId).value;

  for await (const ability of state.cardClass.abilities) {
    if (!ability.validZones.includes(ZoneType.stack)) return;
    if (ability.type !== AbilityType.STATIC) return;
    const canDo = await ability.canDo();

    if (canDo) {
      await ability.do();
    }
  }
}

export async function wasPaid(cardId: string): Promise<boolean> {
  await applyManaCostMods(cardId);

  const { askComplexQuestion, toChoice } = useDialog();
  const choices = [] as boolean[];
  const { getSpentMana } = useMana();
  const { castingCost: manaCost } = getCardById(cardId).value;

  if (manaCost.mana.length === 1 && manaCost.mana[0].types?.length === 0 && manaCost.mana[0].genericCost === 0) {
    return true;
  }

  const promisedChoices = [] as Promise<DialogChoice<string>>[];
  for (const manaPip of manaCost.mana) {
    // if free,
    if (manaPip.genericCost <= 0 && manaPip.types.length === 0) {
      continue;
    }

    // TODO: Look at message groups

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
