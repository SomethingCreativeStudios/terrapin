import { computed, reactive } from 'vue';

const state = reactive({
  turnCount: 0,
  lifeCount: 20,
  landsPerTurn: 1,
  landsPlayed: 0,
});

// @ts-ignore
window.state.gameTracker = state;

function getTurnCount() {
  return computed(() => state.turnCount);
}

function addTurnCount() {
  state.turnCount += 1;
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
  return { getTurnCount, addTurnCount, addLandsPlayed, getLandsPlayed, getAllowedLandsPerTurn, canPlayLand, getLifeCount, setLifeCount, subtractLifeCount, addLifeCount };
}
