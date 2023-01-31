import { ComputedRef } from 'vue';
import { CardState, Card } from '~/models/card.model';
import { useGameState } from '~/composables';

const { getMeta } = useGameState();

export abstract class Effect {
  private cardMeta: ComputedRef<CardState | undefined>;

  constructor(card: Card, public label?: string) {
    this.cardMeta = getMeta(card.cardId);
  }

  public getMeta() {
    //@ts-ignore
    return this.cardMeta.value ?? (this.cardMeta as CardState);
  }

  abstract do(): void;
}
