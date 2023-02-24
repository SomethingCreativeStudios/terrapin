import { ComputedRef } from 'vue';
import { useGameItems } from '~/composables';
import { CardState, Card } from '~/models/card.model';
import { Effect } from '../effects/effect';

const { getCardById } = useGameItems();

export abstract class Watcher {
  private cardMeta: ComputedRef<CardState | undefined>;

  constructor(card: Card, public effects: Effect[]) {
    this.cardMeta = getCardById(card.cardId);
  }

  public getMeta() {
    //@ts-ignore
    return this.cardMeta.value ?? (this.cardMeta as CardState);
  }

  public abstract watch(): void;
}
