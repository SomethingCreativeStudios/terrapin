import { useGameItems } from '~/composables';
import { DelayedTriggeredAbility } from '../abilities/delayed-triggered.ability';
import { Condition } from '../condition';
import { OneShotEffect } from './one-shot.effect';

export class DelayedTriggeredAbilityEffect extends OneShotEffect {
  constructor(cardId: string, private ability: DelayedTriggeredAbility) {
    super(cardId, Condition.createEmpty());
  }

  override async do(meta?: any): Promise<void> {
    const { addDelayedTriggerAbility } = useGameItems();

    this.ability.cardId = this.cardId;
    addDelayedTriggerAbility(this.ability);
  }
}
