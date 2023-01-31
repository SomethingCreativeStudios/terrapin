import { v4 as uuid } from 'uuid';
import { Ability } from '../abilities/ability';
import { Target } from './targets/target';

export abstract class Cost {
  public id = uuid();

  abstract canPay(): boolean;

  abstract pay(ability: Ability, source: Ability, playerId: string, noMana: boolean, costToPlay: Cost): boolean;

  abstract isPaid(): boolean;
  abstract clearPaid(): void;
  abstract clearPaid(): void;
  abstract getTargets(): Target[];
}
