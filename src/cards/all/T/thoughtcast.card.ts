import { BaseCard } from '~/cards/models/base.card';
import { Card } from '~/models/card.model';

export class ThoughtcastCard extends BaseCard {
  static UUID = 'cce9bbff-82dc-4b2f-addd-d6715588de20';

  constructor(card: Card) {
    super(card);
  }
}
