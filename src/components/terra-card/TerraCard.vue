<script lang="tsx">
import { defineComponent, onMounted, PropType } from 'vue';
import { useDraggable } from '~/composables/useDraggable';
import { Card } from '~/models/card.model';
import { DisplayType } from '~/models/zone.model';

export default defineComponent({
  name: 'terra-card',
  props: {
    card: {
      type: Object as PropType<Card>,
      default: () => ({}),
    },

    displayType: {
      type: String as PropType<DisplayType>,
      default: DisplayType.FREE_POSITION,
    },
  },
  setup(props) {
    const { setup } = useDraggable();
    const { draggable } = setup(props.card.position);

    if (props.displayType === DisplayType.SORTABLE) {
      return {};
    }

    return { draggable };
  },
  render() {
    return (
      <div ref="draggable" class="terra-card draggable">
        <img class="terra-card__image" src={this.card.imagePath} />
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.terra-card {
  // width: 6vw;
  width: 122px;
  height: 170px;

  position: absolute;

  z-index: 100;
}

.terra-card.terra-card--relative {
  position: relative;
}

.droppable {
  z-index: 110;
}

.terra-card__image {
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.terra-card--ghosted {
  opacity: 0.6;
}

.selected {
  outline: 3px solid yellow;
}
</style>
