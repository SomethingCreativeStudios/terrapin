import { BaseCard } from '~/cards/models/base.card';
import { Card } from '~/models/card.model';

export class MishrasBaubleCard extends BaseCard {
  static UUID = '63afc3d1-7653-476e-838f-fc18d4a62a21';

  constructor(card: Card) {
    super(card);
  }
}
