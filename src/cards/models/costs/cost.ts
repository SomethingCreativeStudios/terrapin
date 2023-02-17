import { ComputedRef } from 'vue';
import { useGameItems } from '~/composables';
import { CardState, Card } from '~/models/card.model';

const { getCardById } = useGameItems();

export abstract class Cost {
  private cardMeta: ComputedRef<CardState | undefined>;

  constructor(card: Card, public label?: string) {
    this.cardMeta = getCardById(card.cardId);
  }

  public getMeta() {
    //@ts-ignore
    return this.cardMeta.value ?? (this.cardMeta as CardState);
  }

  abstract canPay(): boolean;
  abstract pay(): void;
}
