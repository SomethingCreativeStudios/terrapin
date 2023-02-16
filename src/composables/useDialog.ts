import { computed, ComputedRef, reactive } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { Card } from '~/models/card.model';
import { useEvents } from './useEvents';
import { ActionDialogModel, CardDialogModel, DialogCache, DialogChoice, DialogModel, PromptDialogModel } from '~/models/dialog.model';
import { shuffleDeck } from '~/actions/deck.action';
import { ZoneType } from '~/models/zone.model';
import { TargetMeta, useGameState, UserAction } from './useGameState';
import { Predicate, PredicateCollection } from '~/models/predicates.model';

export const enum DialogEvents {
  PROMPT = 'dialog-prompt',
}

const state = reactive({ dialogs: [] as DialogModel[], actionDialogs: [] as ActionDialogModel<any>[], cache: {} as Record<string, DialogCache> });

//@ts-ignore
window.state.dialog = state;

async function selectFrom(model: CardDialogModel): Promise<Card[]> {
  return new Promise((resolve) => {
    const dialogId = `dialog-${model.currentZone || uuidv4()}`;
    const { onEvent } = useEvents();

    state.dialogs.push({
      title: `${model.currentZone}:`,
      width: '60%',
      height: '80%',
      ...model,
      dialogGroup: model.dialogGroup || 'default',
      dialog: 'terra-card-dialog',
      eventId: dialogId,
    });

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

    state.dialogs.push({ title: 'Prompt', width: '25%', height: '23%', ...prompt, dialogGroup: prompt.dialogGroup || 'default', dialog: 'terra-prompt-dialog', eventId: dialogId });

    // clean up!!!!
    onEvent(dialogId, ({ response }: { response: any }) => {
      state.dialogs = state.dialogs.filter((dialog) => dialog.eventId != dialogId);

      //onSelect(selected);
      resolve(response);
    });
  });
}

function askQuestion<T>(question: string, choices: DialogChoice<T>[], validators: Record<string, () => ComputedRef<boolean>> = {}): Promise<DialogChoice<T>> {
  return new Promise((resolve) => {
    const { emitEvent, onEvent } = useEvents();
    const id = `dialog-${uuidv4()}`;

    state.actionDialogs.push({ id, question, choices, validators, clickOnValid: false });
    emitEvent(DialogEvents.PROMPT, { id, question, choices, validators } as ActionDialogModel<T>);
    onEvent(`${id}-dialog-response`, ({ choice }) => {
      showNextActionDialog(id);
      resolve(choice);
    });
  });
}

function askPriority<T>(): Promise<DialogChoice<T>> {
  return new Promise((resolve) => {
    const { emitEvent, onEvent } = useEvents();
    const id = `dialog-priority-${uuidv4()}`;
    const dialogData = { id, question: 'You Have Priority', choices: toChoice(['Pass']), validators: {}, clickOnValid: false };

    state.actionDialogs.push(dialogData);

    emitEvent(DialogEvents.PROMPT, dialogData);
    onEvent(`${id}-dialog-response`, ({ choice }) => {
      showNextActionDialog(id);
      resolve(choice);
    });
  });
}

function askComplexQuestion<T>(
  question: () => ComputedRef<string>,
  choices: DialogChoice<T>[],
  validators: Record<string, () => ComputedRef<boolean>> = {},
  clickOnValid = false
): Promise<DialogChoice<T>> {
  return new Promise((resolve) => {
    const { emitEvent, onEvent } = useEvents();
    const id = `dialog-${uuidv4()}`;

    state.actionDialogs.push({ id, question, choices, validators, clickOnValid });
    emitEvent(DialogEvents.PROMPT, { id, question, choices, validators, clickOnValid });
    onEvent(`${id}-dialog-response`, ({ choice }) => {
      showNextActionDialog(id);
      resolve(choice);
    });
  });
}

function showStack() {
  const id = `dialog-${uuidv4()}`;

  if (state.dialogs.find((dialog) => dialog.dialogGroup === 'stack')) {
    return;
  }

  state.dialogs.push({ dialogGroup: 'stack', dialog: 'terra-stack', eventId: id });
}

async function findTargets(question = 'Select Targets', affectedZones: ZoneType[], targetMeta: TargetMeta) {
  const { getAllTargets, clearTargets, toggleTargetMode, meetTargetCount } = useGameState();

  toggleTargetMode(targetMeta);

  affectedZones.forEach((zone) => selectFrom({ zone, canMove: true, currentZone: zone, showShuffle: zone === ZoneType.deck, dialogGroup: zone }));

  await askQuestion(
    question,
    [
      { label: 'done', value: 'done' },
      { label: 'cancel', value: 'cancel' },
    ],
    {
      done: () => computed(() => !meetTargetCount().value),
    }
  );

  const targets = [...getAllTargets().value];

  toggleTargetMode(targetMeta);
  clearTargets();

  return targets;
}

function getActiveDialogs() {
  return computed(() => state.dialogs);
}

function toChoice<T>(items: any[]) {
  return items.map((item) => ({ label: item, value: item } as DialogChoice<T>));
}

function getCache(group: string, defaults?: { height: number; width: number; x: number; y: number }) {
  return computed(() => state.cache[group] ?? { height: defaults?.height ?? 660, width: defaults?.width ?? 1355, x: defaults?.x ?? 344, y: defaults?.y ?? 108 });
}

function updateCache(group: string, cache: Partial<DialogCache>) {
  state.cache[group] = { ...state.cache[group], ...cache };
}

function hasPriorityDialogs() {
  return computed(() => state.actionDialogs.find((dialog) => dialog.id?.includes('-priority-')));
}

export function useDialog() {
  return { selectFrom, askComplexQuestion, askQuestion, getActiveDialogs, hasPriorityDialogs, promptUser, getCache, updateCache, findTargets, showStack, askPriority, toChoice };
}

// @ts-ignore
window.findTargets = findTargets;

// @ts-ignore
window.askQuestion = askQuestion;

function showNextActionDialog(id: string) {
  const { emitEvent } = useEvents();

  const index = state.actionDialogs.findIndex((dialog) => dialog.id === id);
  const nextDialog = state.actionDialogs[index - 1];

  if (nextDialog) {
    setTimeout(() => {
      emitEvent(DialogEvents.PROMPT, nextDialog);
    }, 20);
  }

  state.actionDialogs = state.actionDialogs.filter((dialog) => dialog.id !== id);
}
