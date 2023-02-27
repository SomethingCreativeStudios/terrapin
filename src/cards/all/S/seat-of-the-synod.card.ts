import { BaseCard } from '~/cards/models/base.card';
import { Card } from '~/models/card.model';

export class SeatOfTheSynodCard extends BaseCard {
  static UUID = '39451b4d-cd7a-40da-b457-cb51b609173f';

  constructor(card: Card) {
    super(card);
  }
}
