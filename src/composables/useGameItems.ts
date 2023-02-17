import { computed, reactive } from 'vue';
import { Ability } from '~/cards/models/abilities/ability';
import { CardState } from '~/models/card.model';

const state = reactive({
  cardMap: {} as Record<string, CardState>,
  abilityMap: {} as Record<string, Ability>,
});

// @ts-ignore
window.state.gameItems = state;

function getCardById(id: string) {
  return computed(() => state.cardMap[id]);
}

function setCardById(id: string, cardState: Partial<CardState>) {
  state.cardMap[id] = { ...state.cardMap[id], ...cardState };
}

function getAbilityById(id: string) {
  return computed(() => state.abilityMap[id]);
}

function setAbilityById(id: string, abilityState: Ability) {
  state.abilityMap = { ...state.abilityMap, [id]: abilityState };
}

function getCardMap() {
  return computed(() => state.cardMap);
}

function setCardsByIds(ids: string[], cardState: Partial<CardState>) {
  ids.forEach((id) => setCardById(id, cardState));
}

export function useGameItems() {
  return { getCardById, setCardById, setCardsByIds, getAbilityById, setAbilityById, getCardMap };
}
