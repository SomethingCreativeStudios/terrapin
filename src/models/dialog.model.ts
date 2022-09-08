import { Card } from "./card.model";
import { ZoneType } from "./zone.model";

export interface PromptDialogModel extends DialogModel {
    question: string;
    responseType: 'Word' | 'Choice' | 'Number'
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
    suggestions?: string[]
}

export interface ChoicePromptDialogModel extends PromptDialogModel {
    responseType: 'Choice';
    choices: string[]
}

export interface NumberPromptDialogModel extends PromptDialogModel {
    responseType: 'Number';
    min?: number;
    max?: number;
}

export function isNumberPrompt(prompt: PromptDialogModel): prompt is NumberPromptDialogModel {
    return prompt.responseType === 'Number';
}

export function isChoicePrompt(prompt: PromptDialogModel): prompt is ChoicePromptDialogModel {
    return prompt.responseType === 'Choice';
}

export function isWordPrompt(prompt: PromptDialogModel): prompt is WordPromptDialogModel {
    return prompt.responseType === 'Word';
}