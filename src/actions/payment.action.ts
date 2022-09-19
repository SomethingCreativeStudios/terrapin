import { computed } from "vue";
import { useDialog, useGameState } from "~/composables";
import { ManaCost } from "~/models/card.model";
import { TrackerActions } from ".";
import { manaPipToString, meetsPip } from "./helper/mana-cost.helper";

export async function wasPaid(manaCost: ManaCost): Promise<boolean> {
    const { askQuestion } = useDialog();
    const choices = [] as boolean[];

    // Closer...
    // Subtract costs at each step
    // Reset used mana

    for await (const manaPip of manaCost.mana) {
        const choice = await askQuestion(`Pay Mana? ${manaPipToString(manaPip)}`, ['Done', 'Cancel'], {
            'Done': () => computed(() => {
                const { getUsedMana } = useGameState();
                const used = getUsedMana().value;
                const total = Object.values(used).reduce((acc, count) => acc + count, 0);

                return !meetsPip(used, manaPip);
            })
        });

        if (choice === 'Cancel') {
            return false;
        }

        choices.push(choice === 'Done');
    }


   TrackerActions.clearUsedMana();

    return choices.every(Boolean);
}