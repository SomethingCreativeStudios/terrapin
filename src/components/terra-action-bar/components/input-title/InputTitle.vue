<script lang="tsx">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'input-title',
  components: {},
  props: {
    title: {
      type: Object as PropType<Function | string>,
      default: () => {},
    },
  },
  setup(props) {
    if (props.title instanceof Function) {
      return { title: props.title() };
    }

    return { title: props.title };
  },

  render() {
    return <div class="input-block__question" v-html={this.title}></div>;
  },
});
</script>

<style scoped lang="scss"></style>
