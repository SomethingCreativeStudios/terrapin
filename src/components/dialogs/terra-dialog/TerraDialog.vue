<script lang="tsx">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'terra-dialog',
  props: {
    width: {
      type: String,
      default: '60%',
    },
    height: {
      type: String,
      default: '60%',
    },

    show: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const showDialog = ref(props.show);
    const close = () => {
      showDialog.value = false;
      ctx.emit('close', { type: 'selected' });
    };
    const cancel = () => {
      showDialog.value = false;
      ctx.emit('close', { type: 'canceled' });
    };

    return { showDialog, close, cancel };
  },
  methods: {
    onScroll() {
      this.$emit('scroll');
    },
  },
  render() {
    return (
      <div class="terra-dialog" name="modal-fade" v-show={this.showDialog}>
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
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal {
  background: #2a2727;
  box-shadow: 2px 3px 9px 2px #4e4c4c;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  width: v-bind(width);
  height: v-bind(height);
  color: white;
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
