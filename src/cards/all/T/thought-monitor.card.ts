import { BaseCard } from '~/cards/models/base.card';
import { Card } from '~/models/card.model';

export class ThoughtMonitorCard extends BaseCard {
  static UUID = '9deded8b-cec4-4ede-a50b-131404d456d4';

  constructor(card: Card) {
    super(card);
  }
}
