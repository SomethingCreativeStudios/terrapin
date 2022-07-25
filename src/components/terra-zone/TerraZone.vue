<script lang="tsx">
import { computed } from '@vue/reactivity';
import { defineComponent, onMounted, PropType } from 'vue';
import TerraCard from '~/components/terra-card';
import { useSortable } from '~/composables/useSortable';
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
      default: DisplayType.FREE_POSITION,
    },

    color: {
      type: String,
      default: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    },
  },
  setup(props) {
    const { addZone } = useZone();
    const { setup } = useSortable();

    const { zone, zoneRef } = addZone(props.name, props.displayType);
    if (props.displayType === DisplayType.SORTABLE) {
      setup(props.name, zoneRef);
    }

    const cardClass = computed(() => ({
      'terra-card--relative': props.displayType === DisplayType.SORTABLE,
    }));

    return { zoneRef, zone, cardClass };
  },
  render() {
    return (
      <div ref="zoneRef" class={'terra-zone list-group'}>
        {this.zone.cards.length}
        {this.zone.cards.map((card) => (
          <terra-card class={this.cardClass} card={card} displayType={this.displayType} key={card.cardId}></terra-card>
        ))}
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
