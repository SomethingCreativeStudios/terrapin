<script lang="tsx">
import { defineComponent, PropType, ref } from 'vue';
import { Card } from '~/models/card.model';
import { ContainerType } from '~/models/zone.model';
import TerraDialog from '../terra-dialog';
import TerraCard from '../../terra-card';
import { CardDialogModel } from '~/models/dialog.model';
import { useEvents, useMenu } from '~/composables';
import { computed } from '@vue/reactivity';

export default defineComponent({
  name: 'terra-card-dialog',
  components: { TerraDialog, TerraCard },
  props: {
    dialog: {
      type: Object as PropType<CardDialogModel>,
      default: () => {},
    },
  },
  setup(props) {
    const selected = ref([] as Card[]);

    const hoveredCard = ref(null as Card | null);
    const cardNameFilter = ref('');

    const hoveredX = ref('0px');
    const hoveredY = ref('0px');
    const shuffleOnClose = ref(!!props.dialog.showShuffle);

    const selectText = computed(() => {
      const action = props.dialog.canMove ? 'Move' : 'Select';

      if (!props.dialog.min || selected.value.length >= props.dialog.min) return `${action} Cards`;
      return `${action} Cards (${props.dialog.min - selected.value.length})`;
    });

    return { hoveredCard, hoveredX, hoveredY, selected, cardNameFilter, selectText, shuffleOnClose };
  },
  methods: {
    onCardHover(e: any) {
      this.hoveredCard = e.card;
      this.hoveredX = `${e.pos.x}px`;
      this.hoveredY = `${e.pos.y}px`;
    },
    onMouseLeave() {
      this.hoveredCard = null;
    },
    onMouseClick(card: Card) {
      const found = this.selected.find((foundCard) => foundCard.cardId === card.cardId);

      if (found) {
        this.selected = this.selected.filter((foundCard) => foundCard.cardId !== card.cardId);
      } else {
        this.selected.push(card);
      }
    },
    cardFilter(card: Card) {
      if (!this.cardNameFilter) return true;

      return card.name.toLowerCase().includes(this.cardNameFilter.toLowerCase());
    },
    onClose(type: 'canceled' | 'selected') {
      const { emitEvent } = useEvents();
      emitEvent(this.dialog.eventId || '', { selected: type === 'canceled' ? null : this.selected, shuffle: this.shuffleOnClose });
    },

    onContextMenu(e: MouseEvent) {
      e.preventDefault();
      const { buildMoveMenu } = useMenu();
      // @ts-ignore
      this.$contextmenu(
        buildMoveMenu(this.dialog.currentZone, { x: e.x, y: e.y }, this.selected, () => {
          this.onClose('selected');
        })
      );
    },
  },
  render() {
    return (
      <div>
        <terra-dialog show={true} width={this.dialog.width} height={this.dialog.height} onScroll={this.onMouseLeave} onClose={this.onClose}>
          {{
            header: () => (
              <div class="terra-card-dialog__header">
                <div>{this.dialog.title}</div> <input v-model={this.cardNameFilter} placeholder="Search..."></input>
                {this.dialog.showShuffle ? (
                  <div class="shuffle-box">
                    <label class="shuffle-box__label" for="shuffle-box">
                      Shuffle on close?
                    </label>
                    <input class="shuffle-box__box" type="checkbox" text="Shuffle on close?" id="shuffle-box" v-model={this.shuffleOnClose} />
                  </div>
                ) : null}
              </div>
            ),
            body: () => (
              <div class="terra-card-dialog__body">
                {this.dialog.cards.filter(this.cardFilter).map((card) => (
                  <terra-card
                    class={this.selected.find((sel) => sel.cardId === card.cardId) ? 'selected' : ''}
                    card={card}
                    containerType={ContainerType.CARD_DIALOG}
                    flipCard={false}
                    key={card.cardId}
                    onCardHover={this.onCardHover}
                    onMouseleave={this.onMouseLeave}
                    onClick={() => this.onMouseClick(card)}
                    disabled={this.selected.length >= (this.dialog?.max ?? Number.MAX_VALUE)}
                  ></terra-card>
                ))}
              </div>
            ),
            footer: ({ close, cancel }: { close: () => void; cancel: () => void }) => (
              <div class="flex two-col">
                <button
                  type="button"
                  class="btn-green"
                  disabled={this.selected.length === 0 || this.selected.length < (this.dialog?.min ?? 1)}
                  onClick={this.dialog.canMove ? this.onContextMenu : close}
                  aria-label="Close modal"
                >
                  {this.selectText}
                </button>
                <button type="button" class="btn-cancel" onClick={cancel} aria-label="Close modal">
                  Cancel
                </button>
              </div>
            ),
          }}
        </terra-dialog>
        {this.hoveredCard ? (
          <terra-card
            class={this.selected.find((sel) => sel.cardId === this.hoveredCard?.cardId) ? 'terra-card--hovered  selected' : 'terra-card--hovered '}
            key={this.hoveredCard.cardId}
            card={this.hoveredCard}
            containerType={ContainerType.CARD_DIALOG}
            flipCard={false}
          ></terra-card>
        ) : null}
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.terra-card-dialog__body {
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  padding: 80px;
  padding-top: 41px;
}

.terra-card--hovered {
  user-select: none;
  pointer-events: none;

  z-index: 10000;
  top: v-bind(hoveredY);
  left: v-bind(hoveredX);
}

.terra-card-dialog__header {
  width: 100%;
  display: flex;

  > div {
    font-size: 23px;
    padding-right: 10px;
    padding-top: 2px;
    width: fit-content;
  }

  > input {
    width: 60%;
  }
}
</style>
