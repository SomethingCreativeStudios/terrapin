import { ComputedRef } from 'vue';
import { CardState, Card } from '~/models/card.model';
import { useGameItems } from '~/composables';

const { getCardById } = useGameItems();

export abstract class Effect {
  private cardMeta: ComputedRef<CardState | undefined>;

  constructor(card: Card, public label?: string) {
    this.cardMeta = getCardById(card.cardId);
  }

  public getMeta() {
    //@ts-ignore
    return this.cardMeta.value ?? (this.cardMeta as CardState);
  }

  abstract do(meta?: any): void;
}
