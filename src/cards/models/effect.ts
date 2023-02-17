import { Card, CardState } from '~/models/card.model';
import { useGameItems } from '~/composables';
import { ComputedRef } from 'vue';

const { getCardById } = useGameItems();

export enum CardEffectType {
  TRIGGER = 'trigger',
  CONTINUOUS = 'continuous',
}

export abstract class CardEffect {
  abstract canActivate(): boolean;
}

export abstract class CardCost {
  private cardMeta: ComputedRef<CardState | undefined>;

  constructor(card: Card, public label?: string) {
    this.cardMeta = getCardById(card.cardId);
    console.log(this.cardMeta);
  }

  public getMeta() {
    //@ts-ignore
    return this.cardMeta.value ?? (this.cardMeta as CardState);
  }

  abstract meetsRequirements(): boolean;
  abstract pay(): void;
}

export class CostAndPredicate extends CardCost {
  constructor(private costs: CardCost[], label?: string) {
    super({} as Card, label);
  }

  meetsRequirements(): boolean {
    return this.costs.every((cost) => cost.meetsRequirements());
  }

  pay(): void {
    this.costs.forEach((cost) => cost.pay());
  }
}

export class CostOrPredicate extends CardCost {
  constructor(private costs: CardCost[], label?: string) {
    super({} as Card, label);
  }

  meetsRequirements(): boolean {
    return this.costs.some((cost) => cost.meetsRequirements());
  }

  pay(): void {
    this.costs.forEach((cost) => {
      if (cost.meetsRequirements()) {
        cost.pay();
      }
    });
  }
}

export class CostNotPredicate extends CardCost {
  constructor(private costs: CardCost[], label?: string) {
    super({} as Card, label);
  }

  meetsRequirements(): boolean {
    return this.costs.every((cost) => !cost.meetsRequirements());
  }

  pay(): void {
    this.costs.forEach((cost) => {
      if (!cost.meetsRequirements()) {
        cost.pay();
      }
    });
  }
}
