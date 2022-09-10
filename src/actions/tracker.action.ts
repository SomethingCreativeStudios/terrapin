import { useGameState } from '~/composables';
import { ManaCost, ManaType } from '~/models/card.model';
import { ManaCostHelper } from './helper';


export function takeDamage(damage: number) {
    const { getLifeTotal, setLifeTotal } = useGameState();

    setLifeTotal(getLifeTotal().value - damage);
}

export function gainLife(life: number) {
    const { getLifeTotal, setLifeTotal } = useGameState();

    setLifeTotal(getLifeTotal().value + life);
}

export function loseHalfLife(roundDown = true) {
    const { getLifeTotal, setLifeTotal } = useGameState();
    const life = getLifeTotal().value;
    setLifeTotal(Math[roundDown ? 'floor' : 'ceil'](life / 2));
}

export function addMana(manaType: ManaType, amountOfMana = 1) {
    const { getFloatingMana, setFloatingMana } = useGameState();
    const currentFloating = getFloatingMana().value;

    setFloatingMana({ ...currentFloating, [manaType]: (currentFloating[manaType] ?? 0) + 1 });
}

export function useMana(manaType: ManaType, amountOfMana = 1) {
    const { getFloatingMana, setFloatingMana } = useGameState();
    const currentFloating = getFloatingMana().value;

    /// never go negative!!!
    currentFloating[manaType] = Math.max((currentFloating[manaType] ?? 0) - amountOfMana, 0);
    setFloatingMana(currentFloating);
}

/**
 * This needs work...
 * Currently will only say you have total mana available, not correct colors
 * @param manaCost 
 * @returns 
 */
export function hasManaFloatingForCost(manaCost: ManaCost) {
    const totalCost = ManaCostHelper.totalManaCost(manaCost);
    const totalFloating = addAllFloatingMana();

    return totalCost > totalFloating;
}


function addAllFloatingMana() {
    const { getFloatingMana } = useGameState();
    const floating = getFloatingMana().value;
    return Object.keys(ManaType).reduce((acc, type) => acc += floating[type as ManaType] ?? 0, 0);
}