import { computed, reactive } from "vue";
import { CardDialogModel } from "~/models/dialog.model";

const state = reactive({ mulligans: 0 });

function getMulligans() {
    return computed(() => state.mulligans);
}

function doMulligan() {
    state.mulligans += 1;
}

export function useBattleState() {
    return { getMulligans, doMulligan }
}