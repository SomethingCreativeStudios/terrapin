<script lang="tsx">
import { defineComponent } from 'vue';

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
  },
  setup(props) {
    console.log(props.validator);
    return { isDisabled: props.validator() };
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
