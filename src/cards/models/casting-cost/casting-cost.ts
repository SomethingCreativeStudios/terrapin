import { ComputedRef } from 'vue';
import { useGameItems } from '~/composables';
import { CardState, Card } from '~/models/card.model';
import { ZoneType } from '~/models/zone.model';

const { getCardById } = useGameItems();

export abstract class CastingCost {
  private cardMeta: ComputedRef<CardState | undefined>;

  constructor(card: Card, public label?: string, public validZones = [ZoneType.hand]) {
    this.cardMeta = getCardById(card.cardId);
  }

  public getMeta() {
    //@ts-ignore
    return this.cardMeta.value ?? (this.cardMeta as CardState);
  }

  abstract canCast(): boolean;
  abstract cast(): void;
}
