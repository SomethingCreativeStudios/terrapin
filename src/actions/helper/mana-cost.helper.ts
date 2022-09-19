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

export function meetsPip(manaInQuestion: Record<ManaType, number>, pip: ManaPip) {

    if (pip.genericCost) {
        const count = addAllFloatingMana(manaInQuestion);
        console.log(count, pip.genericCost, manaInQuestion, Object.keys(ManaType));
        return count === pip.genericCost;
    }

    return pip.types.some(type => manaInQuestion[type]);
}


export function manaCostToString(cost: ManaCost) {
    return cost.mana.map(manaPipToString).join('');
}

export function manaPipToString(pip: ManaPip) {
    if (pip.genericCost) {
        return `(${pip.genericCost})`
    }

    return `(${pip.types.map(manaTypeToString).join('/')})`;
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
    // @ts-ignore
    return Object.keys(ManaType).reduce((acc, type) => acc += floatingMana[ManaType[type] as ManaType] ?? 0, 0);
}

function manaTypeToString(manaType: ManaType) {
    switch (manaType) {
        case ManaType.BLACK:
            return "(B)"
        case ManaType.BLUE:
            return "(U)"
        case ManaType.COLORLESS:
            return "(C)"
        case ManaType.GREEN:
            return "(G)"
        case ManaType.PHYREXIAN:
            return "(P)"
        case ManaType.RED:
            return "(R)"
        case ManaType.WHITE:
            return "(W)"
        case ManaType.X:
            return "(X)"
        default:
            return ""
    }
}