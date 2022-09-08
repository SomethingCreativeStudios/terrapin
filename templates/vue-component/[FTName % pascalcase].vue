<script lang="tsx">
import { defineComponent } from 'vue';

export default defineComponent({
  name: '<FTName | kebabcase>',
  components: {},
  props: {},
  setup() {},

  render() {
    return (
      <div class="<FTName | kebabcase>">
        <div></div>
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.<FTName|kebabcase > {
  width: 100%;
  height: 100;
}
</style>
