import { computed, reactive } from 'vue';
import { Ability } from '~/cards/models/abilities/ability';
import { StackCollection } from '~/cards/models/stack/stack-collection';
import { StackItem } from '~/cards/models/stack/stack-item';
import { Card, CardState, ManaType } from '~/models/card.model';
import { PhaseType, TurnPhase } from '~/models/phases.model';
import { PredicateCollection } from '~/models/predicates.model';
import { ZoneType } from '~/models/zone.model';
import { phaseSubject } from '~/subjects';
import { useEvents } from './useEvents';
import { usePhase } from './usePhases';
import { useZone } from './useZone';

export interface TargetMeta {
  targetFilter: PredicateCollection<Card> | null;
  maxTargets: number;
  minTargets: number;
}

export enum UserAction {
  NOTHING = 'nothing',
  PAYING_MANA = 'paying-mana',
  MULLIGAN = 'mulligan',
  PICKING_TARGETS = 'picking_targets',
}

export enum GameStateEvent {
  PICKING_TARGETS = '[GAME STATE] picking-targets',
  NORMAL = '[GAME STATE] normal',
  MULLIGAN = '[GAME STATE] mulligan',
}

const state = reactive({
  turnCount: 0,
  lifeCount: 20,
  landsPerTurn: 1,
  landsPlayed: 0,
  floatingMana: {} as Record<ManaType, number>,
  usedMana: {} as Record<ManaType, number>,
  cardMeta: {} as Record<string, CardState>,
  abilities: {} as Record<string, Ability | null>,
  stack: new StackCollection(),
  currentUserAction: UserAction.NOTHING,
  targetMeta: {} as TargetMeta | null,
});

// @ts-ignore
window.state.gameState = state;

function setUp() {
  document.body.setAttribute('user-action', state.currentUserAction);

  phaseSubject.subscribe(({ type, phase }) => {
    if (type === PhaseType.START && phase === TurnPhase.UPKEEP) {
      state.landsPlayed = 0;
    }

    if (type === PhaseType.START && phase === TurnPhase.UPTAP) {
      state.turnCount += 1;
    }
  });
}

function getUserAction() {
  return computed(() => state.currentUserAction);
}

function setUserAction(userAction: UserAction) {
  const { emitEvent } = useEvents();
  state.currentUserAction = userAction;
  document.body.setAttribute('user-action', state.currentUserAction);

  state.targetMeta = null;

  if (userAction === UserAction.PICKING_TARGETS) {
    emitEvent(GameStateEvent.PICKING_TARGETS, {});
  }

  if (userAction === UserAction.MULLIGAN) {
    emitEvent(GameStateEvent.MULLIGAN, {});
  }

  if (userAction === UserAction.NOTHING) {
    emitEvent(GameStateEvent.NORMAL, {});
  }
}

function toggleTargetMode(targetMeta: TargetMeta) {
  if (state.currentUserAction === UserAction.PICKING_TARGETS) {
    setUserAction(UserAction.NOTHING);
  } else {
    setUserAction(UserAction.PICKING_TARGETS);
    state.targetMeta = targetMeta;
  }
}

async function addToStack(item: StackItem, ability?: Ability) {
  if (item.type === 'ABILITY' && ability) {
    state.abilities = { ...(state.abilities ?? {}), [ability?.id]: ability };
  }

  if (item.type === 'SPELL') {
    state.stack.addItem(item);
  }
}

function isStackEmpty() {
  return state.stack.isEmpty();
}

function getStack() {
  return state.stack.getStack();
}

function getTargetMeta() {
  return computed(() => state.targetMeta);
}

function getTurnCount() {
  return computed(() => state.turnCount);
}

function getLifeTotal() {
  return computed(() => state.lifeCount);
}

function canPlayLand() {
  return computed(() => state.landsPlayed < state.landsPerTurn);
}

function setLandsPlayed(x: number) {
  state.landsPlayed = x;
}

function playLand() {
  state.landsPlayed += 1;
}

function getLandsPlayed() {
  return computed(() => state.landsPlayed);
}

function setMaxLandsPerTurn(x: number) {
  state.landsPerTurn = x;
}

function getMaxLandsPerTurn() {
  return computed(() => state.landsPerTurn);
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

function getAllTargets() {
  return computed(() =>
    Object.entries(state.cardMeta).reduce((acc, [_, value]) => {
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

function clearTargets() {
  Object.entries(state.cardMeta).forEach(([key]) => (state.cardMeta[key].targeted = false));
}

export function useGameState() {
  return {
    setUp,
    getTurnCount,
    setLifeTotal,
    getLifeTotal,
    setFloatingMana,
    getFloatingMana,
    getUserAction,
    setUserAction,
    setUsedMana,
    getMeta,
    setMeta,
    playLand,
    setManyMeta,
    getUsedMana,
    getManaOffset,
    canPlayLand,
    setLandsPlayed,
    getLandsPlayed,
    setMaxLandsPerTurn,
    getMaxLandsPerTurn,
    getAllTargets,
    clearTargets,
    toggleTargetMode,
    getTargetMeta,
    meetTargetCount,
    addToStack,
    getStack,
    isStackEmpty,
  };
}
