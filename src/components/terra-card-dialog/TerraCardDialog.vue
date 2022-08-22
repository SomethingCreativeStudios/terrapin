<script lang="tsx">
import { defineComponent, ref } from 'vue';
import TerraDialog from '../terra-dialog';

export default defineComponent({
  name: 'terra-card-dialog',
  components: { TerraDialog },
  props: {
    width: {
      type: String,
      default: '60%',
    },
    height: {
      type: String,
      default: '60%',
    },
  },
  setup(props, ctx) {
    const showDialog = ref(true);
    const close = () => {
      showDialog.value = false;
      ctx.emit('close');
    };

    return { showDialog, close };
  },
  render() {
    return (
      <terra-dialog show={this.showDialog} width={this.width} height={this.height}>
        {{ header: () => <div>test</div>, body: () => <div>cards!</div> }}
      </terra-dialog>
    );
  },
});
</script>

<style scoped lang="scss"></style>
