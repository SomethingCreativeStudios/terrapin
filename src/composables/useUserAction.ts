import { computed, reactive } from 'vue';
import { Card } from '~/models/card.model';
import { PredicateCollection } from '~/models/predicates.model';
import { useEvents } from './useEvents';
import { useGameItems } from './useGameItems';

export enum UserState {
  NEUTRAL = 'neutral',
  MULLIGAN = 'mulligan',
  RESPONDING_TO_STACK = 'responding to stack',
}

export enum UserAction {
  PICKING_TARGETS = '[USER ACTION] picking_targets',
  PAYING_MANA = '[USER ACTION] paying-mana',
  RESOLVING_ABILITY = '[USER ACTION] resolving ability',
  RESOLVING_SPELL = '[USER ACTION] resolving spell',
  COMBAT = '[USER ACTION] combat',
  MULLIGAN = '[USER ACTION] mulligan',
}

export interface TargetMeta {
  targetFilter: PredicateCollection<Card> | null;
  maxTargets: number;
  minTargets: number;
}

const state = reactive({
  targetMeta: null as TargetMeta | null,
  userState: UserState.NEUTRAL,
  actions: [] as UserAction[],
});

// @ts-ignore
window.state.userAction = state;

function startAction(userAction: UserAction, actionMeta = {}) {
  const { emitEvent } = useEvents();

  if (!state.actions.includes(userAction)) {
    state.actions.push(userAction);
  }

  emitEvent(userAction, { type: 'START', ...actionMeta });
}

function endAction(userAction: UserAction, actionMeta = {}) {
  const { emitEvent } = useEvents();

  if (state.actions.includes(userAction)) {
    state.actions = state.actions.filter((action) => action !== userAction);
    emitEvent(userAction, { type: 'END', ...actionMeta });
  }
}

function chooseTargets(targetMeta: TargetMeta) {
  startAction(UserAction.PICKING_TARGETS, targetMeta);
  state.targetMeta = targetMeta;
}

function resolveTargets() {
  const { setCardById, getCardMap } = useGameItems();
  endAction(UserAction.PICKING_TARGETS);
  state.targetMeta = null;

  Object.keys(getCardMap().value).forEach((id) => setCardById(id, { targeted: false }));
}

function getTargetMeta() {
  return computed(() => state.targetMeta);
}

function getAllTargets() {
  const { getCardMap } = useGameItems();

  return computed(() =>
    Object.entries(getCardMap().value).reduce((acc, [_, value]) => {
      return value.targeted ? acc.concat(value?.baseCard?.cardId) : acc;
    }, [] as string[])
  );
}

function meetTargetCount() {
  return computed(() => {
    const targetCount = getAllTargets().value?.length ?? 0;
    const minCards = state.targetMeta?.minTargets ?? 0;
    const maxCards = state.targetMeta?.maxTargets ?? 0;

    console.log(targetCount < minCards, targetCount > maxCards);
    if (targetCount < minCards) return false;
    if (targetCount > maxCards) return false;

    return true;
  });
}

function userDoingAction(userAction: UserAction) {
  return computed(() => state.actions.includes(userAction));
}

export function useUserAction() {
  return { startAction, endAction, chooseTargets, resolveTargets, getTargetMeta, userDoingAction, meetTargetCount, getAllTargets };
}
