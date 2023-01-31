import { ComputedRef } from 'vue';
import { useGameState } from '~/composables';
import { CardState, Card } from '~/models/card.model';

const { getMeta } = useGameState();

export abstract class CastingCost {
  private cardMeta: ComputedRef<CardState | undefined>;

  constructor(card: Card, public label?: string) {
    this.cardMeta = getMeta(card.cardId);
  }

  public getMeta() {
    //@ts-ignore
    return this.cardMeta.value ?? (this.cardMeta as CardState);
  }

  abstract canCast(): boolean;
  abstract cast(): void;
}
