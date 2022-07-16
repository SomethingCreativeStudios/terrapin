<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { useDraggable } from '~/composables/useDraggable';
import { Card } from '~/models/card.model';

export default defineComponent({
  props: {
    card: {
      type: Object as PropType<Card>,
      default: () => ({}),
    },
  },
  setup() {
    const { setup } = useDraggable();
    const { draggable } = setup();

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
  width: 6vw;
}

.terra-card__image {
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.selected {
  outline: 3px solid yellow;
}
</style>
