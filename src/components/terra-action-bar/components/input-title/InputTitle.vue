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

<style scoped lang="scss">
.input-block__question {
  display: flex;
  column-gap: 5px;
}

:deep() {
  .mana-pip {
    width: 21px;
    background-repeat: no-repeat;
    background-size: 18px;
  }

  .mana-pip--generic {
    background-color: rgb(166, 159, 157);
    width: 18px;
    height: 19px;
    border-radius: 50%;

    @for $i from 1 through 15 {
      .mana-pip--generic-number-#{$i}::after {
        content: '#{$i}';
        width: 100%;
        text-align: center;
        display: inline-table;
        font-weight: bolder;
        vertical-align: middle;
      }
    }
  }

  .mana-pip--blue {
    background-image: url('/mana/U.png');
  }
}
</style>
