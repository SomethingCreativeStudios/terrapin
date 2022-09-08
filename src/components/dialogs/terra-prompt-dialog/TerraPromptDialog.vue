<script lang="tsx">
import { defineComponent, PropType, ref } from 'vue';
import { useEvents } from '~/composables';
import TerraDialog from '../terra-dialog';
import { PromptDialogModel, isChoicePrompt, isNumberPrompt, isWordPrompt } from '~/models/dialog.model';

export default defineComponent({
  name: 'terra-prompt-dialog',
  components: { TerraDialog },
  props: {
    dialog: {
      type: Object as PropType<PromptDialogModel>,
      default: () => {},
    },
  },
  setup(props) {
    const dialogType = ref(props.dialog.dialog);
    const response = ref('' as any);

    return { dialogType, response };
  },
  methods: {
    onClose() {
      const { emitEvent } = useEvents();
      emitEvent(this.dialog.eventId || '', { response: this.response });
    },
  },

  render() {
    const wordDialog = isWordPrompt(this.dialog) ? (
      <div class="terra-prompt-dialog__block">
        <div class="terra-prompt-dialog__question">{this.dialog.question}</div>
        <input class="terra-prompt-dialog__input" v-model={this.response}></input>
      </div>
    ) : null;
    const choiceDialog = isChoicePrompt(this.dialog) ? (
      <div class="terra-prompt-dialog__block">
        <div class="terra-prompt-dialog__question">{this.dialog.question}</div>
        <select class="terra-prompt-dialog__input" v-model={this.response}>
          {this.dialog.choices.map((choice) => (
            <option value={choice}>{choice}</option>
          ))}
        </select>
      </div>
    ) : null;
    const numberDialog = isNumberPrompt(this.dialog) ? (
      <div class="terra-prompt-dialog__block">
        <div class="terra-prompt-dialog__question">{this.dialog.question}</div>
        <input class="terra-prompt-dialog__input" type="number" v-model={this.response}></input>
      </div>
    ) : null;

    return (
      <div class="terra-prompt-dialog">
        <terra-dialog show={true} width={this.dialog.width} height={this.dialog.height} onScroll={this.onMouseLeave} onClose={this.onClose}>
          {{
            header: () => (
              <div class="terra-card-dialog__header">
                <div>{this.dialog.title}</div>
              </div>
            ),
            body: () => (
              <div class="terra-prompt-dialog__body">
                {wordDialog}
                {choiceDialog}
                {numberDialog}
              </div>
            ),
            footer: ({ close, cancel }: { close: () => void; cancel: () => void }) => (
              <div class="flex two-col">
                <button type="button" class="btn-green" disabled={!this.response} onClick={close} aria-label="Close modal">
                  Done
                </button>
                <button type="button" class="btn-cancel" onClick={cancel} aria-label="Close modal">
                  Cancel
                </button>
              </div>
            ),
          }}
        </terra-dialog>
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.terra-prompt-dialog {
  width: 100%;
  height: 100;
}

.terra-prompt-dialog__body {
  padding: 16px;
}

.terra-prompt-dialog__block {
  display: flex;
  flex-direction: column;

  row-gap: 10px;
}

.terra-prompt-dialog__question {
  text-align: center;
}

.terra-prompt-dialog__input {
  width: 100%;
}
</style>
