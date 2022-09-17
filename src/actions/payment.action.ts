import { computed } from "vue";
import { useDialog, useGameState } from "~/composables";
import { ManaCost } from "~/models/card.model";
import { TrackerActions } from ".";
import { meetsCost } from "./helper/mana-cost.helper";

export async function wasPaid(manaCost: ManaCost): Promise<boolean> {
    const { askQuestion } = useDialog();

    //Figure out how to use floating mana!!!

    const choice = await askQuestion('Pay Mana?', ['Done', 'Cancel'], {
        'Done': () => computed(() => {
            const { getUsedMana } = useGameState();
            const used = getUsedMana().value;
            const total = Object.values(used).reduce((acc, count) => acc + count, 0);

            return !meetsCost(used, manaCost);
        })
    });

    const usedMana = TrackerActions.clearUsedMana();

    if (choice === 'Cancel') {
        return false;
    }

    return false;
}