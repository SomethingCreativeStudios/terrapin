import { computed, reactive } from 'vue';
import { CardState, ManaType } from '~/models/card.model';

export enum UserAction {
  NOTHING = 'nothing',
  PAYING_MANA = 'paying-mana',
  MULLIGAN = 'mulligan',
  PICKING_TARGETS = 'picking_targets',
}

const state = reactive({
  lifeCount: 20,
  floatingMana: {} as Record<ManaType, number>,
  usedMana: {} as Record<ManaType, number>,
  cardMeta: {} as Record<string, CardState>,
  currentUserAction: UserAction.NOTHING,
});

// @ts-ignore
window.state.gameState = state;

function setUp() {
  document.body.setAttribute('user-action', state.currentUserAction);
}

function getUserAction() {
  return computed(() => state.currentUserAction);
}

function setUserAction(userAction: UserAction) {
  state.currentUserAction = userAction;
  document.body.setAttribute('user-action', state.currentUserAction);
}

function getLifeTotal() {
  return computed(() => state.lifeCount);
}

function setLifeTotal(lifeTotal: number) {
  state.lifeCount = lifeTotal;
}

function setFloatingMana(mana: Record<ManaType, number>) {
  state.floatingMana = mana;
}

function getFloatingMana() {
  return computed(() => state.floatingMana);
}

function setUsedMana(mana: Record<ManaType, number>) {
  state.usedMana = mana;
}

function getUsedMana() {
  return computed(() => state.usedMana);
}

function getManaOffset(color: ManaType) {
  return computed(() => (state.floatingMana[color] || 0) - (state.usedMana[color] || 0));
}

function getMeta(cardId: string) {
  return computed(() => state.cardMeta[cardId]);
}

function setMeta(cardId: string, meta: Partial<CardState>) {
  state.cardMeta[cardId] = { ...state.cardMeta[cardId], ...meta };
}

function setManyMeta(ids: string[], meta: Partial<CardState>) {
  ids.forEach((id) => {
    setMeta(id, meta);
  });
}

export function useGameState() {
  return {
    setUp,
    setLifeTotal,
    getLifeTotal,
    setFloatingMana,
    getFloatingMana,
    getUserAction,
    setUserAction,
    setUsedMana,
    getMeta,
    setMeta,
    setManyMeta,
    getUsedMana,
    getManaOffset,
  };
}
