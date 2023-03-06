import { computed, reactive } from 'vue';
import { v4 as uuid } from 'uuid';
import { Ability } from '~/cards/models/abilities/ability';
import { Card, CardState } from '~/models/card.model';
import { cards as cardClassMap } from '~/cards';
import { BaseCard } from '~/cards/models/base.card';
import { Effect, EffectType } from '~/cards/models/effects/effect';
import { EventType } from '~/cards/models/game-event';
import { ContinuousEffect } from '~/cards/models/effects/continuous-effect.effect';
import { Duration, durationToEventMap } from '~/cards/models/other-constants';
import { AsThoughEffect } from '~/cards/models/effects/as-though.effect';
import { useZone } from './useZone';
import { DelayedTriggeredAbility } from '~abilities';
import { cardIdSubject } from '~/subjects';

const state = reactive({
  cardMap: {} as Record<string, CardState>,
  abilityMap: {} as Record<string, Ability>,
  globalEffects: [] as Effect[],
  delayedAbilities: [] as DelayedTriggeredAbility[],
});

// @ts-ignore
window.state.gameItems = state;

function addCardToMap(card: Card) {
  const CardClass = cardClassMap[card.oracleId] as BaseCard;

  setCardById(card.cardId, { baseCard: card, castingCost: card.manaCost });

  // @ts-ignore
  setCardById(card.cardId, { cardClass: CardClass ? new CardClass(card) : new BaseCard(card) });
}

function getCardById(id: string) {
  return computed(() => state.cardMap[id]);
}

function resetCardId(currentId: string) {
  const { swapCardId } = useZone();
  const current = { ...state.cardMap[currentId] };
  const CardClass = cardClassMap[current.baseCard.oracleId] as BaseCard;

  delete state.cardMap[currentId];
  current.baseCard.cardId = uuid();
  // @ts-ignore
  current.cardClass = CardClass ? new CardClass(current.baseCard) : new BaseCard(current.baseCard);

  state.cardMap[current.baseCard.cardId] = current;
  swapCardId(currentId, current.baseCard.cardId);

  cardIdSubject.next({ newId: current.baseCard.cardId, oldId: currentId });

  return current.baseCard.cardId;
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

function getManyCardsByIds(ids: string[]) {
  return ids.map((id) => state.cardMap[id]);
}

function getAllCards() {
  return computed(() => Object.values(state.cardMap));
}

function cleanUpEffects() {
  state.globalEffects = state.globalEffects.filter((effect) => !effect.canBeDeleted);
}

function getGlobalEffects() {
  return computed(() => state.globalEffects);
}

function addGlobalEffect(effect: Effect) {
  state.globalEffects.push(effect);
}

function addDelayedTriggerAbility(ability: DelayedTriggeredAbility) {
  state.delayedAbilities.push(ability);
}

function markEffectAsDeleted(id: string) {
  state.globalEffects.forEach((effect) => {
    if (effect.id === id) {
      effect.canBeDeleted = true;
    }
  });
}

async function processDuration(type: EventType) {
  const hasDuration = (effect: Effect | ContinuousEffect): effect is ContinuousEffect => {
    return (effect as ContinuousEffect).duration !== undefined;
  };

  const globalEffects = state.globalEffects as Effect[];
  const delayedAbilities = [...(state.delayedAbilities as DelayedTriggeredAbility[])];

  for await (const effect of globalEffects) {
    if (effect.effectType === EffectType.ONE_SHOT) return;

    if (hasDuration(effect) && !effect.canBeDeleted) {
      effect.canBeDeleted = durationToEventMap[effect.duration] === type;
    }
  }

  for await (const ability of delayedAbilities) {
    if (ability.meetsGameEvent(type)) {
      await ability.do();

      if (ability.getDuration() === Duration.ONE_USE) {
        state.delayedAbilities = state.delayedAbilities.filter((delayed) => delayed.id !== ability.id);
      }
    }
  }
}

function getAllAsThoughEffects() {
  const isAsThough = (effect: Effect | AsThoughEffect): effect is AsThoughEffect => {
    return (effect as AsThoughEffect).asThoughType !== undefined;
  };

  return computed(() => (state.globalEffects as Effect[]).filter(isAsThough));
}

export function useGameItems() {
  return {
    getAllCards,
    getManyCardsByIds,
    addCardToMap,
    getCardById,
    setCardById,
    setCardsByIds,
    getAbilityById,
    setAbilityById,
    getCardMap,
    cleanUpEffects,
    getGlobalEffects,
    addGlobalEffect,
    markEffectAsDeleted,
    processDuration,
    getAllAsThoughEffects,
    resetCardId,
    addDelayedTriggerAbility,
  };
}
