import { computed, reactive } from 'vue';
import { ManaType } from '~/models/card.model';
import { useEvents } from './useEvents';
import { UserAction, useUserAction } from './useUserAction';

const state = reactive({
  spentMana: {} as Record<ManaType, number>,
  floatingMana: {} as Record<ManaType, number>,
  oldFloatingMana: {} as Record<ManaType, number>,
});

// @ts-ignore
window.state.mana = state;

function setUp() {
  const { onEvent } = useEvents();

  onEvent(UserAction.PAYING_MANA, ({ type } = {}) => {
    if (type === 'START') {
      state.oldFloatingMana = { ...state.floatingMana };
    }
  });
}

function setFloatingMana(mana: Record<ManaType, number>) {
  state.floatingMana = mana;
}

function addFloatingMana(mana: ManaType, amount = 1) {
  const { userDoingAction } = useUserAction();
  state.floatingMana = { ...state.floatingMana, [mana]: (state.floatingMana[mana] ?? 0) + amount };

  if (userDoingAction(UserAction.PAYING_MANA)) {
    state.oldFloatingMana = { ...state.oldFloatingMana, [mana]: (state.oldFloatingMana[mana] ?? 0) + amount };
  }
}

function getFloatingMana() {
  return computed(() => state.floatingMana);
}

function getSpentMana() {
  return computed(() => state.spentMana);
}

function spendMana(mana: Record<ManaType, number>) {
  state.spentMana = mana;
}

function resetMana() {
  state.floatingMana = { ...state.oldFloatingMana };
  state.oldFloatingMana = getEmptyManaPool();
}

function clearManaPool() {
  state.spentMana = getEmptyManaPool();
  state.floatingMana = getEmptyManaPool();
  state.oldFloatingMana = getEmptyManaPool();
}

function getManaOffset(color: ManaType) {
  return computed(() => (state.floatingMana[color] || 0) - (state.spentMana[color] || 0));
}

export function useMana() {
  return { setUp, getFloatingMana, setFloatingMana, spendMana, getSpentMana, resetMana, clearManaPool, getManaOffset, addFloatingMana };
}

function getEmptyManaPool() {
  return Object.keys(ManaType).reduce((acc, type) => ({ ...acc, [type]: 0 }), {} as Record<ManaType, number>);
}
