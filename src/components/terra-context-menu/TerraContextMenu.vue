<script lang="tsx">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'terra-context-menu',
  props: {
    display: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const show = ref(false);

    const close = () => {};

    return { show, close };
  },
  render() {
    return (
      <div class="terra-context-menu" ref="context" v-show={this.show} tabindex="0" {...{ blur: this.close }}>
        {this.$slots?.default?.({})}
      </div>
    );
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
