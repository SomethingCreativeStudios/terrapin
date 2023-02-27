import { BaseCard } from '~/cards/models/base.card';
import { Card } from '~/models/card.model';

export class MoxOpalCard extends BaseCard {
  static UUID = 'de2440de-e948-4811-903c-0bbe376ff64d';

  constructor(card: Card) {
    super(card);
  }
}
