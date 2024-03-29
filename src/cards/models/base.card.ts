import { Card } from '~/models/card.model';
import { Ability } from './abilities/ability';

export interface BaseCardID {
  UUID: string;
}
export abstract class BaseCard {
  public static UUID: string;

  public abilities = [] as Ability[];
  public spellAbility = [] as Ability[];

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
