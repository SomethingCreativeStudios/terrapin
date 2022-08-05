<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import TerraCard from '~/components/terra-card';
import { ContainerType, ZoneType } from '~/models/zone.model';
import { useTerraZone } from './composables/useTerraZone';

export default defineComponent({
  name: 'terra-zone',
  components: { TerraCard },
  props: {
    name: {
      type: String as PropType<ZoneType>,
      default: '',
    },

    containerType: {
      type: String as PropType<ContainerType>,
      default: ContainerType.FREE_POSITION,
    },

    color: {
      type: String,
      default: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    },

    disableHover: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { setUpZone } = useTerraZone();
    const { zone, zoneRef, zoneClasses } = setUpZone(props.name, props.containerType, props.disableHover);

    return { zoneRef, zone, zoneClasses };
  },
  render() {
    const firstCard = this.zone.cards[0];
    const secondCard = this.zone.cards[1];

    const cards = this.zone.cards.map((card) => <terra-card card={card} containerType={this.containerType} flipCard={false} key={card.cardId}></terra-card>);
    const backOfCard = firstCard ? (
      <div>
        {secondCard ? <terra-card class="terra-zone__card" card={secondCard} containerType={this.containerType} flipCard={true} key={secondCard.cardId}></terra-card> : null}
        <terra-card class="terra-zone__card" card={firstCard} containerType={this.containerType} flipCard={true} key={firstCard.cardId}></terra-card>
      </div>
    ) : null;

    const zoneHeader = (
      <div class="terra-zone__header">
        <div class="terra-zone__header--title">{this.name}</div>
        {this.$slots?.['header']?.() ?? <div></div>}
      </div>
    );
    return (
      <div ref="zoneRef" class={this.zoneClasses}>
        {zoneHeader}
        {this.containerType === ContainerType.DIALOG ? backOfCard : cards}
        {this.$slots?.['default']?.()}
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.terra-zone {
  width: 100%;
  height: 100%;

  background: v-bind(color);

  padding: 10px;

  display: flex;
}

.terra-zone__header {
  position: absolute;
}

.droppable-target {
  background: yellow;
}

.test {
  width: 122px;
  height: 170px;

  background-color: brown;
  margin-left: 10px;
}
</style>
