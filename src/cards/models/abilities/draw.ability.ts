import { Card } from '~/models/card.model';
import { ZoneType } from '~/models/zone.model';
import { DrawEffect } from '../effects/draw.effect';
import { Ability } from './ability';

export class DrawAbility extends Ability {
  constructor(card: Card, numberToDraw: number, validZones = [ZoneType.battlefield]) {
    super([], new DrawEffect(numberToDraw, card, 'Draw Cards'), 'Draw Cards', validZones);
  }

  canDo(): boolean {
    return true;
  }

  do(): void {
    this.effect.do();
  }
}
