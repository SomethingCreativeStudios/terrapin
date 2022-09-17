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

export function meetsCost(manaInQuestion: Record<ManaType, number>, cost: ManaCost) {
    const convertedCost = manaCostToRecord(cost);
    const withoutColor = minusMana(manaInQuestion, convertedCost);
    if (!withoutColor) return false;
    return true;
}


function minusMana(manaInQuestion: Record<ManaType, number>, cost: Record<ManaType, number>): Record<ManaType, number> | null {
    let couldNotPay = false;
    const without = Object.entries(cost).reduce((acc, [manaType, howMuch]) => {
        if (manaInQuestion[manaType as ManaType] < howMuch) {
            couldNotPay = true;
            return acc;
        }

        return { ...acc, [manaType]: (acc?.[manaType as ManaType] ?? 0) - howMuch };
    }, manaInQuestion);

    return couldNotPay ? null : without;
}

function manaCostToRecord(cost: ManaCost) {
    return cost.mana.reduce((acc, pip) => {
        if (pip.types?.length === 0) {
            return { ...acc, [ManaType.COLORLESS]: (acc?.[ManaType.COLORLESS] ?? 0) + pip.genericCost }
        }

        return { ...acc, [pip.types[0]]: (acc?.[pip.types[0]] ?? 0) + 1 };
    }, {} as Record<ManaType, number>)
}

function addAllFloatingMana(floatingMana: Record<ManaType, number>) {
    return Object.keys(ManaType).reduce((acc, type) => acc += floatingMana[type as ManaType] ?? 0, 0);
}