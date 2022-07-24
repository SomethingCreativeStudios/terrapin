<script lang="tsx">
import { computed } from '@vue/reactivity';
import { defineComponent, PropType } from 'vue';
import TerraCard from '~/components/terra-card';
import { useContainer } from '~/composables/useContainer';
import { useZone } from '~/composables/useZone';
import { DisplayType } from '~/models/zone.model';

export default defineComponent({
  name: 'terra-zone',
  components: { TerraCard },
  props: {
    name: {
      type: String,
      default: '',
    },

    displayType: {
      type: String as PropType<DisplayType>,
      default: DisplayType.TOP_LEFT,
    },

    color: {
      type: String,
      default: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    },
  },
  setup(props) {
    const { addZone } = useZone();
    const { setup } = useContainer();

    const { zone, zoneRef } = addZone(props.name, props.displayType);
    const { container } = setup(zoneRef);

    const cardClass = computed(() => ({
      'terra-card--relative': props.displayType === DisplayType.FLEX_ROW,
    }));

    return { zoneRef, zone, cardClass };
  },
  render() {
    return (
      <div ref="zoneRef" class="terra-zone">
        {this.zone.cards.map((card) => (
          <terra-card class={this.cardClass} card={card} key={card.cardId}></terra-card>
        ))}
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.terra-zone {
  position: relative;
  width: 100%;
  height: 100%;

  background: v-bind(color);

  padding: 10px;

  display: flex;
}

.droppable-target {
  background: yellow;
}
</style>
