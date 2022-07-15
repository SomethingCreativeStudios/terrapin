<script lang="tsx">
import { defineComponent, PropType, ref, onMounted } from 'vue';
import interact from 'interactjs';
import { Card } from '~/models/card.model';

export default defineComponent({
  props: {
    card: {
      type: Object as PropType<Card>,
      default: () => ({}),
    },
  },
  setup(_) {
    const item = ref(null);
    const position = ref({ x: 0, y: 0 });

    onMounted(() => {
      console.log(item.value);
      interact(item.value as any).draggable({
        listeners: {
          start(event) {
            console.log(position);
            console.log(event.type, event.target);
          },
          move(event) {
            position.value.x += event.dx;
            position.value.y += event.dy;

            event.target.style.transform = `translate(${position.value.x}px, ${position.value.y}px)`;
          },
        },
      });
    });

    return { position, item };
  },
  render() {
    return (
      <div ref="item" class="terra-card draggable">
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
}
</style>
