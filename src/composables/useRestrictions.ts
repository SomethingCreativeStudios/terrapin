import { reactive } from 'vue';
import { Restriction } from '~/models/restriction.model';

const state = reactive({ global: {} as Record<string, Restriction[]>, cards: {} as Record<string, Restriction[]> });

// @ts-ignore
window.state.restrictions = state;

function gsxg();

export function useRestrictions() {
  return {};
}
