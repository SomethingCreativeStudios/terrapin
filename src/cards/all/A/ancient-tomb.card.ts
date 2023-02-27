import { BaseCard } from '~/cards/models/base.card';
import { Card, ManaType } from '~/models/card.model';

export class AncientTombCard extends BaseCard {
  static UUID = '23467047-6dba-4498-b783-1ebc4f74b8c2';

  constructor(card: Card) {
    super(card);
  }
}
