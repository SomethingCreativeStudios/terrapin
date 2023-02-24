import { computed, reactive } from 'vue';
import { EventType } from '~/cards/models/game-event';
import { eventSubject, GameEvent } from '~/subjects';

const state = reactive({
  currentEvent: {} as GameEvent,
  lastEvent: {} as GameEvent,
  turnCount: 0,
  lifeCount: 20,
  landsPerTurn: 1,
  landsPlayed: 0,
});

// @ts-ignore
window.state.gameTracker = state;

function setUp() {
  eventSubject.subscribe((event: GameEvent) => {
    state.lastEvent = state.currentEvent;
    state.currentEvent = event;
  });
}

function getEventType() {
  return computed(() => state.currentEvent);
}

function getTurnCount() {
  return computed(() => state.turnCount);
}

function addTurnCount() {
  state.turnCount += 1;
}

function resetLandsPlayed() {
  state.landsPlayed = 0;
}

function getLandsPlayed() {
  return computed(() => state.landsPlayed);
}

function addLandsPlayed() {
  state.landsPlayed += 1;
}

function getAllowedLandsPerTurn() {
  return computed(() => state.landsPerTurn);
}

function canPlayLand() {
  return computed(() => state.landsPlayed < state.landsPerTurn);
}

function getLifeCount() {
  return computed(() => state.lifeCount);
}

function setLifeCount(newCount: number) {
  state.lifeCount = newCount;
}

function addLifeCount(life: number) {
  state.lifeCount += life;
}

function subtractLifeCount(life: number) {
  state.lifeCount -= life;
}

export function useGameTracker() {
  return {
    setUp,
    getTurnCount,
    addTurnCount,
    addLandsPlayed,
    getLandsPlayed,
    getAllowedLandsPerTurn,
    canPlayLand,
    getLifeCount,
    setLifeCount,
    subtractLifeCount,
    addLifeCount,
    resetLandsPlayed,
    getEventType,
  };
}
