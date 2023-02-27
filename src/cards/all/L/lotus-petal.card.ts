import { BaseCard } from '~/cards/models/base.card';
import { Card } from '~/models/card.model';

export class LotusPetalCard extends BaseCard {
  static UUID = '32e5339e-9e4f-46f8-b305-f9d6d3ba8bb5';

  constructor(card: Card) {
    super(card);
  }
}
