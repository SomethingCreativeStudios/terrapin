import { computed, reactive } from "vue";
import { ManaType } from "~/models/card.model";

const state = reactive({ lifeCount: 20, floatingMana: {} as Record<ManaType, number> });

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

export function useGameState() {
    return { setLifeTotal, getLifeTotal, setFloatingMana, getFloatingMana }
}