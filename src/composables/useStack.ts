import { reactive } from 'vue';
import { Ability } from '~/cards/models/abilities/ability';
import { StackCollection } from '~/cards/models/stack/stack-collection';
import { StackItem } from '~/cards/models/stack/stack-item';
import { useGameItems } from './useGameItems';

const state = reactive({ stack: new StackCollection() });

// @ts-ignore
window.state.stack = state;

async function addToStack(item: StackItem, ability?: Ability) {
  const { setAbilityById } = useGameItems();

  if (item.type === 'ABILITY' && ability) {
    setAbilityById(item.id, ability);
  }

  state.stack.addItem(item);
}

function isStackEmpty() {
  return state.stack.isEmpty();
}

function getStack() {
  return state.stack.getStack();
}

export function useStack() {
  return { addToStack, isStackEmpty, getStack };
}
