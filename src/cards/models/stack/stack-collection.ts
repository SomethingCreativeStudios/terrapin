import { StackItem } from './stack-item';
import { useDialog, useGameItems, useZone } from '~/composables';
import { computed, ref } from 'vue';
import { ZoneType } from '~/models/zone.model';

export class StackCollection {
  private stackItems = ref([] as StackItem[]);

  private get stackValue() {
    // @ts-ignore
    return this.stackItems.value ? this.stackItems.value : (this.stackItems as StackItem[]);
  }

  constructor() {}

  async addItem(item: StackItem) {
    if (this.stackValue.length === 0) {
      const { showStack } = useDialog();
      showStack();
    }

    this.stackValue.push(item);
    const stillWaiting = await this.handleResponse();

    if (!stillWaiting) {
      await this.resolve();
    }
  }

  public async resolve() {
    while (this.stackValue.length) {
      const item = this.stackValue.pop();
      if (item?.type === 'SPELL') {
        await this.castSpell(item.id, item);
      }

      if (item?.type === 'ABILITY') {
        const { getAbilityById } = useGameItems();
        await getAbilityById(item.id).value.do(true);
      }
    }
  }

  public printStack() {
    this.stackValue.forEach((item, index) => console.log(`Item ${index}: ${item.id}`));
  }

  public getStack() {
    return computed(() => this.stackValue);
  }

  public inStack(id: string) {
    return !!this.stackValue.find((item) => item.id === id);
  }

  public isEmpty() {
    return computed(() => this.stackValue.length === 0);
  }

  private async handleResponse() {
    const { askPriority, hasPriorityDialogs } = useDialog();

    await askPriority();

    return hasPriorityDialogs().value;
  }

  private async castSpell(id: string, item: StackItem) {
    const { getCardById, setCardById } = useGameItems();
    const { moveCard } = useZone();

    const state = getCardById(id).value;
    const card = state.baseCard;

    // TODO: Make isSpell filter
    const isSpell = card.cardTypes.includes('Instant') || card.cardTypes.includes('Sorcery');

    if (!isSpell) {
      setCardById(card.cardId, { position: item.position });
      moveCard(ZoneType.stack, ZoneType.battlefield, id);
    } else {
      const cardState = getCardById(id);

      for await (const ability of cardState.value.cardClass.spellAbility) {
        if (await ability.canDo()) {
          await ability.do(true);
        }
      }

      setCardById(card.cardId, { position: item.position });
      moveCard(ZoneType.stack, ZoneType.graveyard, id);
    }
  }
}
