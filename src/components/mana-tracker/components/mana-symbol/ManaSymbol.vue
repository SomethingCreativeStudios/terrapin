<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { ManaType } from '~/models/card.model';
import { useUserAction, useMana, UserAction } from '~/composables';
import { computed, ref } from '@vue/reactivity';
import { TrackerActions } from '~/actions';

export default defineComponent({
  name: 'mana-symbol',
  components: {},
  props: {
    manaType: {
      type: String as PropType<ManaType>,
      default: () => ManaType.GENERIC,
    },
  },
  setup(props) {
    const { userDoingAction } = useUserAction();
    const { getManaOffset, getFloatingMana } = useMana();

    const colorMap = {
      [ManaType.BLACK]: 'black',
      [ManaType.BLUE]: 'blue',
      [ManaType.COLORLESS]: 'grey',
      [ManaType.GREEN]: 'green',
      [ManaType.RED]: 'red',
      [ManaType.WHITE]: 'white',
    } as Record<ManaType, string>;

    const shadowColorMap = {
      [ManaType.BLACK]: '#8b7171',
      [ManaType.BLUE]: '#8b7171',
      [ManaType.COLORLESS]: 'black',
      [ManaType.GREEN]: 'black',
      [ManaType.RED]: 'black',
      [ManaType.WHITE]: 'black',
    } as Record<ManaType, string>;

    const selectedColor = ref(colorMap[props.manaType]);
    const shadowColor = ref(shadowColorMap[props.manaType]);
    const isPayingMana = userDoingAction(UserAction.PAYING_MANA);

    const spendMana = () => {
      if (!isPayingMana.value) return;
      TrackerActions.spendFloating(props.manaType);
    };

    return {
      selectedColor,
      isPayingMana,
      shadowColor,
      spendMana,
      count: computed(() => (isPayingMana.value ? getManaOffset(props.manaType).value : getFloatingMana().value[props.manaType] || 0)),
    };
  },

  render() {
    return (
      <div class={`mana-symbol mana-symbol--${this.count > 0 ? 'has-count' : 'empty'}`}>
        {this.isPayingMana ? null : (
          <div class="mana-symbol--text mana-symbol__remove" onClick={() => TrackerActions.useMana(this.manaType)}>
            -
          </div>
        )}{' '}
        <div
          class="mana-symbol--text mana-symbol__add"
          onClick={() => (this.isPayingMana ? TrackerActions.undoSpentFloating(this.manaType) : TrackerActions.addMana(this.manaType))}
        >
          +
        </div>
        <div class="mana-symbol__image" onClick={this.spendMana}>
          <div class="mana-symbol__count">{this.count}</div>
          <img src={`/mana/${this.manaType}.png`} />
        </div>
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.mana-symbol {
  position: relative;
  display: grid;

  grid-template:
    'plus'
    'image'
    'minus';
}

.mana-symbol--text {
  justify-self: center;
  font-size: 20px;
  color: v-bind(selectedColor);
  text-shadow: 2px 2px 2px v-bind(shadowColor);
}

.mana-symbol--text:hover {
  cursor: pointer;
}

.mana-symbol__remove {
  grid-area: minus;
}

.mana-symbol__add {
  grid-area: plus;

  padding-bottom: 5px;
}

.mana-symbol__image {
  grid-area: image;
  width: 15px;
  height: 15px;

  img,
  > div {
    position: absolute;
  }
}

.mana-symbol__count {
  visibility: hidden;
  font-size: 15px;
  z-index: 10;
  width: 15px;
  text-align: center;

  color: white;
}

.mana-symbol--has-count {
  .mana-symbol__count {
    visibility: visible;
  }

  .mana-symbol__image img {
    opacity: 0.4;
  }
}

[user-action='paying-mana'] {
  .mana-symbol__image {
    cursor: pointer;
  }
}
</style>
