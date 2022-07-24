<script lang="tsx">
import { defineComponent } from 'vue';
import { useContainer } from '~/composables/useContainer';

export default defineComponent({
  name: 'terra-zone',
  props: {},
  setup() {
    const { setup } = useContainer();
    const { container } = setup();

    return { container };
  },
  render() {
    return (
      <div ref="container" class="terra-card draggable">
        <img class="terra-card__image" src={this.card.imagePath} />
      </div>
    );
  },
});
</script>

<style scoped lang="scss"></style>
