import { ComputedRef } from 'vue';
import { Card } from './card.model';
import { ZoneType } from './zone.model';

export type DialogChoice<T> = { label: string; value: T };

export interface ActionDialogModel<T> {
  id: string;
  clickOnValid: boolean;
  choices: DialogChoice<T>[];
  question: string | (() => ComputedRef<string>);
  validators: Record<string, () => ComputedRef<boolean>>;
}

export interface PromptDialogModel extends DialogModel {
  question: string;
  responseType: 'Word' | 'Choice' | 'Number';
}

export interface DialogModel {
  dialog?: string;
  eventId?: string;
  width?: string;
  height?: string;
  title?: string;
}

export interface CardDialogModel extends DialogModel {
  cards: Card[];
  min?: number;
  max?: number;
  canMove?: boolean;
  showShuffle?: boolean;
  currentZone: ZoneType;
}

export interface WordPromptDialogModel extends PromptDialogModel {
  responseType: 'Word';
  suggestions?: string[];
}

export interface ChoicePromptDialogModel<T> extends PromptDialogModel {
  responseType: 'Choice';
  choices: DialogChoice<T>[];
}

export interface NumberPromptDialogModel extends PromptDialogModel {
  responseType: 'Number';
  min?: number;
  max?: number;
}

export function isNumberPrompt(prompt: PromptDialogModel): prompt is NumberPromptDialogModel {
  return prompt.responseType === 'Number';
}

export function isChoicePrompt<T>(prompt: PromptDialogModel): prompt is ChoicePromptDialogModel<T> {
  return prompt.responseType === 'Choice';
}

export function isWordPrompt(prompt: PromptDialogModel): prompt is WordPromptDialogModel {
  return prompt.responseType === 'Word';
}
