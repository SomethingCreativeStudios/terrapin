import { computed, reactive } from 'vue';
import { Interpreter, AnyEventObject, ResolveTypegenMeta, TypegenDisabled, BaseActionObject, ServiceMap, InterpreterStatus } from 'xstate';
import { CardState, ManaType } from '~/models/card.model';
import { PhaseType, TurnPhase } from '~/models/phases.model';
import { startPhases } from '~/states/phase.state';
import { phaseSubject } from '~/watchers/phase.watcher';

type PhaseState = Interpreter<
  any,
  any,
  AnyEventObject,
  {
    value: any;
    context: any;
  },
  ResolveTypegenMeta<TypegenDisabled, AnyEventObject, BaseActionObject, ServiceMap>
>;

export enum UserAction {
  NOTHING = 'nothing',
  PAYING_MANA = 'paying-mana',
  MULLIGAN = 'mulligan',
  PICKING_TARGETS = 'picking_targets',
}

const state = reactive({
  turnCount: 0,
  lifeCount: 20,
  landsPerTurn: 1,
  landsPlayed: 0,
  floatingMana: {} as Record<ManaType, number>,
  usedMana: {} as Record<ManaType, number>,
  cardMeta: {} as Record<string, CardState>,
  currentUserAction: UserAction.NOTHING,
  phaseState: {} as PhaseState,
});

// @ts-ignore
window.state.gameState = state;

function setUp() {
  document.body.setAttribute('user-action', state.currentUserAction);
  state.phaseState = startPhases();

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
  state.currentUserAction = userAction;
  document.body.setAttribute('user-action', state.currentUserAction);
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

function nextPhase() {
  if (state.phaseState.status === InterpreterStatus.NotStarted) {
    state.phaseState.start();
  }

  state.phaseState.send('NEXT');
}

export function useGameState() {
  return {
    setUp,
    nextPhase,
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
  };
}
