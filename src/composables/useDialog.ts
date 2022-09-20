import { computed, ComputedRef, reactive } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { Card } from '~/models/card.model';
import { useEvents } from './useEvents';
import { CardDialogModel, DialogModel, PromptDialogModel } from '~/models/dialog.model';
import { shuffleDeck } from '~/actions/deck.action';
import { ZoneType } from '~/models/zone.model';

export const enum DialogEvents {
  PROMPT = 'dialog-prompt',
}

const state = reactive({ dialogs: [] as DialogModel[] });

async function selectFrom(model: CardDialogModel): Promise<Card[]> {
  return new Promise((resolve) => {
    const dialogId = `dialog-${uuidv4()}`;
    const { onEvent } = useEvents();

    state.dialogs.push({ title: 'Select From:', width: '60%', height: '80%', ...model, dialog: 'terra-card-dialog', eventId: dialogId });

    // clean up!!!!
    onEvent(dialogId, ({ selected, shuffle = false }: { selected: Card[]; shuffle: boolean }) => {
      state.dialogs = state.dialogs.filter((dialog) => dialog.eventId != dialogId);

      if (shuffle && model.currentZone === ZoneType.deck) {
        shuffleDeck();
      }

      resolve(selected);
    });
  });
}

function promptUser(prompt: PromptDialogModel) {
  return new Promise((resolve) => {
    const dialogId = `dialog-${uuidv4()}`;
    const { onEvent } = useEvents();

    state.dialogs.push({ title: 'Prompt', width: '25%', height: '23%', ...prompt, dialog: 'terra-prompt-dialog', eventId: dialogId });

    // clean up!!!!
    onEvent(dialogId, ({ response }: { response: any }) => {
      state.dialogs = state.dialogs.filter((dialog) => dialog.eventId != dialogId);

      //onSelect(selected);
      resolve(response);
    });
  });
}

function askQuestion(question: string, choices: string[], validators: Record<string, () => ComputedRef<boolean>> = {}): Promise<string> {
  return new Promise((resolve) => {
    const { emitEvent, onEvent } = useEvents();

    emitEvent(DialogEvents.PROMPT, { question, choices, validators });
    onEvent(`${DialogEvents.PROMPT}-response`, ({ choice }) => resolve(choice));
  });
}

function askComplexQuestion(question: () => ComputedRef<string>, choices: string[], validators: Record<string, () => ComputedRef<boolean>> = {}, clickOnValid = false): Promise<string> {
  return new Promise((resolve) => {
    const { emitEvent, onEvent } = useEvents();

    emitEvent(DialogEvents.PROMPT, { question, choices, validators, clickOnValid });
    onEvent(`${DialogEvents.PROMPT}-response`, ({ choice }) => resolve(choice));
  });
}

function getActiveDialogs() {
  return computed(() => state.dialogs);
}

export function useDialog() {
  return { selectFrom, askComplexQuestion, askQuestion, getActiveDialogs, promptUser };
}
