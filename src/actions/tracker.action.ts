import { useGameTracker, useMana as useManaComposable } from '~/composables';
import { ManaCost, ManaType } from '~/models/card.model';
import { ManaCostHelper } from './helper';

export function takeDamage(damage: number) {
  const { subtractLifeCount } = useGameTracker();

  subtractLifeCount(damage);
}

export function gainLife(life: number) {
  const { addLifeCount } = useGameTracker();

  addLifeCount(life);
}

export function loseHalfLife(roundDown = true) {
  const { getLifeCount, setLifeCount } = useGameTracker();
  const life = getLifeCount().value;
  setLifeCount(Math[roundDown ? 'floor' : 'ceil'](life / 2));
}

export function addMana(manaType: ManaType, amountOfMana = 1) {
  const { addFloatingMana } = useManaComposable();

  addFloatingMana(manaType, amountOfMana);
}

export function useMana(manaType: ManaType, amountOfMana = 1) {
  const { getFloatingMana, setFloatingMana } = useManaComposable();
  const currentFloating = getFloatingMana().value;

  /// never go negative!!!
  currentFloating[manaType] = Math.max((currentFloating[manaType] ?? 0) - amountOfMana, 0);
  setFloatingMana(currentFloating);
}

export function spendFloating(manaType: ManaType, amountOfMana = 1) {
  const { getSpentMana, getFloatingMana, spendMana } = useManaComposable();

  const currentFloating = getFloatingMana().value;
  const currentUsed = getSpentMana().value;

  currentUsed[manaType] = Math.min((currentUsed[manaType] ?? 0) + amountOfMana, currentFloating[manaType] ?? 0);
  spendMana(currentUsed);
}

export function undoSpentFloating(manaType: ManaType, amountOfMana = 1) {
  const { getSpentMana, spendMana } = useManaComposable();

  const currentUsed = getSpentMana().value;
  currentUsed[manaType] = Math.max((currentUsed[manaType] ?? 0) - amountOfMana, 0);
  spendMana(currentUsed);
}

export function clearUsedMana() {
  const { spendMana, getSpentMana } = useManaComposable();

  const usedMana = { ...getSpentMana().value };
  spendMana({} as any);

  return usedMana;
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
  const { getFloatingMana } = useManaComposable();
  const floating = getFloatingMana().value;
  return Object.keys(ManaType).reduce((acc, type) => (acc += floating[type as ManaType] ?? 0), 0);
}
