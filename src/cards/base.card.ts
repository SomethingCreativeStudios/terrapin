import { Card } from '~/models/card.model';
import { Ability } from './models/abilities/ability';
import { CastingCost } from './models/casting-cost/casting-cost';
import { CardCost, CardEffect } from './models/effect';

export interface BaseCardID {
  UUID: string;
}
export abstract class BaseCard {
  public static UUID: string;

  public abilities = [] as Ability[];
  public castingCosts = [] as CastingCost[];

  constructor(card: Card) {}
}

export enum CardType {
  ARTIFICAT = 'Artifact',
  CREATURE = 'Creature',
  DUNGEON = 'Dungeon',
  ENCHANTMENT = 'Enchantment',
  INSTANT = 'Instant',
  PLANESWALKER = 'Planeswalker',
  SORCERY = 'Sorcery',
  TRIBAL = 'Tribal',
}
