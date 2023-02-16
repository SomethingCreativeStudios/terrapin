<script lang="tsx">
import { defineComponent, ref } from 'vue';
import Vue3DraggableResizable from 'vue3-draggable-resizable';
import { useDialog } from '~/composables';

export default defineComponent({
  name: 'terra-dialog',
  components: { Vue3DraggableResizable },
  props: {
    width: {
      type: String,
      default: '60%',
    },
    height: {
      type: String,
      default: '60%',
    },

    group: {
      type: String,
      default: 'default',
    },

    defaults: {
      type: Object,
      default: {},
    },

    show: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, ctx) {
    const showDialog = ref(props.show);
    const selected = ref(false);

    const close = () => {
      //showDialog.value = false;
      ctx.emit('close', { type: 'selected' });
    };
    const cancel = () => {
      //showDialog.value = false;
      ctx.emit('close', { type: 'canceled' });
    };

    const { getCache } = useDialog();
    const cache = getCache(props.group, props.defaults);

    return { showDialog, selected, cache, close, cancel };
  },
  methods: {
    onScroll() {
      this.$emit('scroll');
    },

    onResize({ x, y, w: width, h: height }: { x: number; y: number; w: number; h: number }) {
      const { updateCache } = useDialog();
      updateCache(this.group, { x, y, width, height });
    },

    onDragEnd({ x, y }: { x: number; y: number }) {
      const { updateCache } = useDialog();
      updateCache(this.group, { x, y });
    },
  },
  render() {
    return (
      <vue3-draggable-resizable
        class={`terra-dialog terra-dialog--${this.selected ? 'selected' : 'deselected'}`}
        name="modal-fade"
        initW={this.cache.width}
        initH={this.cache.height}
        x={this.cache.x}
        y={this.cache.y}
        v-show={this.showDialog}
        onDragEnd={this.onDragEnd}
        onResizeEnd={this.onResize}
        onActivated={() => (this.selected = true)}
        onDeactivated={() => (this.selected = false)}
      >
        <div class="modal-backdrop">
          <div class="modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
            <header class="modal-header" id="modalTitle">
              {this.$slots?.['header']?.() ?? <div></div>}
              <button type="button" class="btn-close" onClick={this.cancel} aria-label="Close modal">
                x
              </button>
            </header>

            <section class="modal-body" id="modalDescription" onscroll={this.onScroll}>
              {this.$slots?.['body']?.() ?? <div></div>}
            </section>

            <footer class="modal-footer">
              {this.$slots?.['footer']?.({ close: this.close, cancel: this.cancel }) ?? (
                <button type="button" class="btn-green" onClick={this.close} aria-label="Close modal">
                  Close me!
                </button>
              )}
            </footer>
          </div>
        </div>
      </vue3-draggable-resizable>
    );
  },
});
</script>

<style scoped lang="scss">
.terra-dialog {
  z-index: 900;
}

.terra-dialog--selected {
  z-index: 901;
}

.modal-backdrop {
  width: 100%;
  height: 100%;
}

.modal {
  background: #2a2727;
  box-shadow: 2px 3px 9px 2px #4e4c4c;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  color: white;
  width: 100%;
  height: 100%;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;

  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  flex-direction: column;
}

.modal-body {
  position: relative;
  flex: 1;
  overflow-x: hidden;
  overflow-y: scroll;

  width: 100%;
  height: 100%;
}

.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  font-size: 20px;
  padding: 4px;
  cursor: pointer;
  font-weight: bold;
  color: #5c5b5b;
  background: transparent;
}

.btn-green {
  color: white;
  background: #181818;
  border: 1px solid #5c5b5b;
  border-radius: 2px;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
</style>
