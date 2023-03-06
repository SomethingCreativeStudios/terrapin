import { ComputedRef } from 'vue';
import { useGameItems } from '~/composables';
import { CardState, Card } from '~/models/card.model';

const { getCardById } = useGameItems();

export abstract class Cost {
  constructor(public cardId: string) {}

  public getCardState() {
    const { getCardById } = useGameItems();
    const cardState = getCardById(this.cardId);

    //@ts-ignore
    return cardState.value ?? (cardState as CardState);
  }

  abstract canPay(): Promise<boolean>;
  abstract pay(): Promise<void>;
}
