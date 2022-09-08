<script lang="tsx">
import { defineComponent } from 'vue';
import { InputBlock } from './components';

export default defineComponent({
  name: 'terra-action-bar',
  components: { InputBlock },
  props: {},
  setup() {},

  render() {
    return (
      <div class="terra-action-bar">
        <div></div>
        <div class="input-block">
          <input-block></input-block>
        </div>
        <div></div>
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.terra-action-bar {
  width: 100%;
  height: 100%;

  display: grid;
  background: #6e6b6b;

  border: black 12px solid;

  grid-template-rows: 1fr 200px 1fr;
}
</style>
