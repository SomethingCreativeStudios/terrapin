import { v4 as uuid } from 'uuid';
import { CardState, Card } from '~/models/card.model';
import { useGameItems } from '~/composables';
import { Condition } from '../condition/condition';
import { Ability } from '../abilities/ability';

const { getCardById } = useGameItems();

export abstract class Effect {
  public id = uuid();

  public label = '';

  public effectType = EffectType.ONE_SHOT;
  public canBeDeleted = false;

  constructor(private cardId: string, public condition?: Condition) {}

  public getCardState() {
    const { getCardById } = useGameItems();
    const cardState = getCardById(this.cardId);

    //@ts-ignore
    return cardState.value ?? (cardState as CardState);
  }

  protected abstract effect(meta?: any): Promise<void>;

  protected async meetsCondition(source: Ability) {
    return (await this.condition?.meets(source)) ?? true;
  }

  async do(meta?: any) {
    await this.effect(meta);
  }
}

export enum EffectType {
  ONE_SHOT = 'one shot',
  CONTINUOUS = 'continuous',
  CONTINUOUS_RULE_MODIFICATION = 'layered rule modification',
  REPLACEMENT = 'replacement',
  PREVENTION = 'prevention',
  REDIRECTION = 'redirection',
  AS_THOUGH = 'as though effect',
  RESTRICTION = 'restriction',
  RESTRICTION_UNTAP_NOT_MORE_THAN = 'restriction untap not more than effect',
  REQUIRMENT = 'requirment',
  COST_MODIFICATION = 'cost modification',
  SPLICE = 'splice',
}
