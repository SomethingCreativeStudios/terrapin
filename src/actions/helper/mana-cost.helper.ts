import { useGameState } from "~/composables";
import { ManaCost, ManaPip, ManaType } from "~/models/card.model";

export function totalManaCost(mana: ManaCost) {
    const { getLifeTotal } = useGameState();
    let lifeTotal = getLifeTotal().value;

    return mana.mana.reduce((acc, pip) => {
        const canBeLife = pip.types.includes(ManaType.PHYREXIAN);

        if (canBeLife) {
            lifeTotal -= 2;
        }

        const regCost = pip.types.length > 0 ? 1 : pip.genericCost;

        return acc + (canBeLife && lifeTotal > 0 ? 0 : regCost)
    }, 0);
}

export function meetsType(manaPip: ManaPip, mana: Record<ManaType, number>) {
    if (manaPip.types.length === 0) {
        return addAllFloatingMana(mana) >= manaPip.genericCost;
    }

    return manaPip.types.some(type => {
        return mana[type] >= 1;
    });
}


function addAllFloatingMana(floatingMana: Record<ManaType, number>) {
    return Object.keys(ManaType).reduce((acc, type) => acc += floatingMana[type as ManaType] ?? 0, 0);
}