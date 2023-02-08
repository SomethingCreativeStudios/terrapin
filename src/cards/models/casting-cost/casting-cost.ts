import { ComputedRef } from 'vue';
import { useGameState } from '~/composables';
import { CardState, Card } from '~/models/card.model';
import { ZoneType } from '~/models/zone.model';

const { getMeta } = useGameState();

export abstract class CastingCost {
  private cardMeta: ComputedRef<CardState | undefined>;

  constructor(card: Card, public label?: string, public validZones = [ZoneType.hand]) {
    this.cardMeta = getMeta(card.cardId);
  }

  public getMeta() {
    //@ts-ignore
    return this.cardMeta.value ?? (this.cardMeta as CardState);
  }

  abstract canCast(): boolean;
  abstract cast(): void;
}
