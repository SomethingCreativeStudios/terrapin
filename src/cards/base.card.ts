import { Card } from '~/models/card.model';
import { CardCost, CardEffect } from './models/effect';

export class BaseCard {
  public effects = [] as CardEffect[];
  public costs = [] as CardCost[];
  public castingCosts = [] as CardCost[];

  constructor(card: Card) {}
}
