<script lang="tsx">
import { defineComponent, PropType, ref } from 'vue';
import { Card, CardPosition } from '~/models/card.model';
import { ContainerType } from '~/models/zone.model';
import TerraDialog from '../terra-dialog';
import TerraCard from '../terra-card';

export default defineComponent({
  name: 'terra-card-dialog',
  components: { TerraDialog, TerraCard },
  props: {
    width: {
      type: String,
      default: '60%',
    },
    height: {
      type: String,
      default: '60%',
    },
    cards: {
      type: Array as PropType<Card[]>,
      default: () => [],
    },
  },
  setup(props, ctx) {
    const showDialog = ref(true);
    const hoveredCard = ref(null as Card | null);

    const hoveredX = ref('0px');
    const hoveredY = ref('0px');

    const close = () => {
      showDialog.value = false;
      ctx.emit('close');
    };

    return { showDialog, close, hoveredCard, hoveredX, hoveredY };
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
  },
  render() {
    return (
      <div>
        <terra-dialog show={this.showDialog} width={this.width} height={this.height} onScroll={this.onMouseLeave}>
          {{
            header: () => <div>test</div>,
            body: () => (
              <div class="terra-card-dialog__body">
                {this.cards.map((card) => (
                  <terra-card
                    card={card}
                    containerType={ContainerType.CARD_DIALOG}
                    flipCard={false}
                    key={card.cardId}
                    onCardHover={this.onCardHover}
                    onMouseleave={this.onMouseLeave}
                  ></terra-card>
                ))}
              </div>
            ),
          }}
        </terra-dialog>
        {this.hoveredCard ? (
          <terra-card class="terra-card--hovered" key={this.hoveredCard.cardId} card={this.hoveredCard} containerType={ContainerType.CARD_DIALOG} flipCard={false}></terra-card>
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
</style>
