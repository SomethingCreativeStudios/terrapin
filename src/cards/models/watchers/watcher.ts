import { ComputedRef } from 'vue';
import { useGameState } from '~/composables';
import { CardState, Card } from '~/models/card.model';
import { Effect } from '../effects/effect';

const { getMeta } = useGameState();

export abstract class Watcher {
  private cardMeta: ComputedRef<CardState | undefined>;

  constructor(card: Card, public effect: Effect) {
    this.cardMeta = getMeta(card.cardId);
  }

  public getMeta() {
    //@ts-ignore
    return this.cardMeta.value ?? (this.cardMeta as CardState);
  }

  public abstract watch(): void;
}
