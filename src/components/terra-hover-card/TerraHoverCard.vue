<script lang="tsx">
import { defineComponent } from 'vue';
import { useCard } from '~/composables/useCard';

export default defineComponent({
  name: 'terra-hover-card',
  setup() {
    const { getHoveredCard } = useCard();

    return { hoverCard: getHoveredCard() };
  },
  render() {
    return <div class="terra-hover-card">{this.hoverCard?.imagePath ? <img class="terra-hover-card__image" src={this.hoverCard.imagePath} /> : null}</div>;
  },
});
</script>

<style scoped lang="scss">
.terra-hover-card {
  width: 302px;
  height: 420px;

  z-index: 100;
  pointer-events: none;
}
.terra-hover-card__image {
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
