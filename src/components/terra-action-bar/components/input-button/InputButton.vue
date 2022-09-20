<script lang="tsx">
import { defineComponent, onMounted, watch } from 'vue';

export default defineComponent({
  name: 'input-button',
  components: {},
  props: {
    choice: {
      type: String,
      default: '',
    },

    validator: {
      type: Function,
      default: () => {},
    },

    clickOnValid: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const isDisabled = props.validator();
    if (props.clickOnValid) {
      onMounted(() => {
        watch(props.validator() as any, () => ctx.emit('click'));
      });
    }
    return { isDisabled };
  },

  render() {
    return (
      <button class="input-block__choice" disabled={this.isDisabled}>
        {this.choice}
      </button>
    );
  },
});
</script>

<style scoped lang="scss"></style>
