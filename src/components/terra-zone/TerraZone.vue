<script lang="tsx">
import { defineComponent, PropType, ref } from 'vue';
import TerraCard from '~/components/terra-card';
import { ContainerType, ZoneType } from '~/models/zone.model';
import { useTerraZone } from './composables/useTerraZone';
import { useMenu, useGameState } from '~/composables';

const { getMeta } = useGameState();

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
  methods: {
    onContextMenu(e: MouseEvent) {
      e.preventDefault();
      const { getMenu } = useMenu();
      this.$contextmenu(getMenu(this.name, { x: e.x, y: e.y }) as any);
    },
  },
  render() {
    const firstCard = getMeta(this.zone.cardIds[0]).value;
    const secondCard = getMeta(this.zone.cardIds[1]).value;

    const cards = this.zone.cardIds.map((id) => <terra-card card={getMeta(id)?.value?.baseCard} containerType={this.containerType} flipCard={false} key={id}></terra-card>);
    const backOfCard = firstCard ? (
      <div>
        {secondCard ? (
          <terra-card class="terra-zone__card" card={secondCard?.baseCard} containerType={this.containerType} flipCard={true} key={secondCard.baseCard?.cardId}></terra-card>
        ) : null}
        <terra-card class="terra-zone__card" card={firstCard?.baseCard} containerType={this.containerType} flipCard={true} key={firstCard?.baseCard?.cardId}></terra-card>
      </div>
    ) : null;

    const zoneHeader = (
      <div class="terra-zone__header" onClick={this.onContextMenu}>
        <div class="terra-zone__header--title">
          {this.name} ({this.zone.cardIds.length})
        </div>
        {this.$slots?.['header']?.() ?? <div></div>}
      </div>
    );
    return (
      <div ref="zoneRef" class={this.zoneClasses}>
        {zoneHeader}
        {this.containerType === ContainerType.TOP_CARD ? backOfCard : cards}
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
  position: relative;
}

.terra-zone.disabled {
  pointer-events: none;
  opacity: 0.75;
}

.terra-zone__header {
  position: absolute;
  color: #f1e8e8;
  width: 91%;
  text-align: center;
}

.droppable-target {
  background: #5c5b5b;
}
</style>
