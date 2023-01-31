import { Card } from '~/models/card.model';
import { DrawEffect } from '../effects/draw.effect';
import { Ability } from './ability';

export class DrawAbility extends Ability {
  constructor(card: Card, numberToDraw: number) {
    super([], new DrawEffect(numberToDraw, card, 'Draw Cards'), 'Draw Cards');
  }

  canDo(): boolean {
    return true;
  }

  do(): void {
    this.effect.do();
  }
}
