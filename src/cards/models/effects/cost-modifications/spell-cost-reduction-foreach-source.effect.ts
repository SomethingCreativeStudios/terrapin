import { ComputedRef } from 'vue';
import { useGameItems } from '~/composables';
import { ManaCost, ManaPip, ManaType } from '~/models/card.model';
import { Duration } from '../../other-constants';
import { CostModificationEffect, CostModificationType } from './cost-modification.effect';

export class SpellCostReductionForEachSourceEffect extends CostModificationEffect {
  private reduceGenericMana = null as number | null;
  private manaType = null as ManaType | null;
  private ammount = () => null as ComputedRef<number> | null;

  public static genericReduction(cardId: string, reduceGenericMana: number, ammount: () => ComputedRef<number>) {
    const effect = new SpellCostReductionForEachSourceEffect(cardId, Duration.WHILE_ON_STACK, CostModificationType.REDUCE_COST);
    effect.reduceGenericMana = reduceGenericMana;
    effect.ammount = ammount;
    return effect;
  }

  public static manaPipsReduction(cardId: string, manaType: ManaType, ammount: () => ComputedRef<number>) {
    const effect = new SpellCostReductionForEachSourceEffect(cardId, Duration.WHILE_ON_STACK, CostModificationType.REDUCE_COST);
    effect.manaType = manaType;
    effect.ammount = ammount;
    return effect;
  }

  protected async effect(meta?: any): Promise<void> {
    const { setCardById } = useGameItems();
    const card = this.getCardState();
    const calcValue = this.ammount()?.value ?? 0;

    console.log(calcValue);

    if (this.manaType) {
      setCardById(card.baseCard.cardId, { castingCost: this.adjustManaPip({ ...card.baseCard.manaCost }, this.manaType, calcValue) });
      return;
    }

    setCardById(card.baseCard.cardId, { castingCost: this.adjustGenricMana({ ...card.baseCard.manaCost }, calcValue) });

    return;
  }

  private adjustGenricMana(manaCost: ManaCost, ammount: number): ManaCost {
    return { ...manaCost, mana: manaCost.mana.map((mana) => (mana.genericCost ? { ...mana, genericCost: Math.max(mana.genericCost - ammount, 0) } : mana)) };
  }

  private adjustManaPip(manaCost: ManaCost, manaType: ManaType, ammount: number): ManaCost {
    return { ...manaCost, mana: [...Array(ammount).keys()].reduce((acc, keys) => acc.filter((mana) => mana.types.length === 1 && mana.types[0] === manaType), manaCost.mana) };
  }
}
