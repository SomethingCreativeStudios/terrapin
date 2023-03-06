import { v4 as uuid } from 'uuid';
import { useGameItems, useStack } from '~/composables';
import { ZoneType } from '~/models/zone.model';
import { cardIdSubject } from '~/subjects';
import { Condition } from '../condition/condition';
import { Cost } from '../costs/cost';
import { Effect } from '../effects/effect';

export enum AbilityType {
  PLAY_LAND = 'Play Land',
  MANA = 'Mana',
  SPELL = 'Spell',
  ACTIVATED = 'Activated',
  STATIC = 'Static',
  TRIGGERED = 'Triggered',
  EVASION = 'Evasion',
  LOYALTY = 'Loyalty',
  SPECIAL_ACTION = 'Special Action',
  SPECIAL_MANA_PAYMENT = 'Special Mana Payment',
}

export enum TimingRule {
  INSTANT,
  SORCERY,
}

export abstract class Ability {
  public id = uuid();

  public timing = TimingRule.INSTANT;
  public isSpellAbility = false;
  public condition = null as Condition | null;
  public label = 'Do Ability';

  constructor(public cardId: string, public costs: Cost[], public effects: Effect[], public type = AbilityType.ACTIVATED, public validZones = [ZoneType.battlefield]) {
    // Follow card as it changes zones
    cardIdSubject.subscribe(({ newId, oldId }) => {
      if (oldId !== this.cardId) return;
      this.cardId = newId;
    });
  }

  public getCardState() {
    const { getCardById } = useGameItems();
    const cardState = getCardById(this.cardId);

    //@ts-ignore
    return cardState.value ?? (cardState as CardState);
  }

  async canDo(): Promise<boolean> {
    return this.defaultCanDo();
  }

  protected async defaultCanDo() {
    const meetsCondition = (await this.condition?.meets(this)) ?? true;
    const canDoCosts = await this.canPayCosts();
    const meetsZones = this.validZones.includes(this.getCardState().zone || ZoneType.none);
    return meetsCondition && meetsZones && canDoCosts;
  }

  protected async doAllEffects() {
    for await (const effect of this.effects) {
      if ((await effect.condition?.meets(this)) ?? true) {
        await effect.do();
      } else {
        return;
      }
    }
  }

  protected async canPayCosts() {
    for await (const cost of this.costs) {
      if (!(await cost.canPay())) {
        return false;
      }
    }
    return true;
  }

  protected async payAllCosts() {
    for await (const cost of this.costs) {
      if (await cost.canPay()) {
        await cost.pay();
      } else {
        return;
      }
    }
  }

  protected async doEffects() {
    await this.doAllEffects();
  }

  abstract ability(): Promise<void>;

  async do(fromStack = false): Promise<void> {
    const { addToStack } = useStack();

    if (doesNotUseTheStack.includes(this.type) || fromStack) {
      this.ability();
    } else {
      if (!(await this.canPayCosts())) return;

      await this.payAllCosts();
      setTimeout(() => {
        addToStack({ id: this.id, type: 'ABILITY' }, this);
      }, 100);
    }
  }
}

const doesNotUseTheStack = [AbilityType.MANA, AbilityType.PLAY_LAND, AbilityType.STATIC];
