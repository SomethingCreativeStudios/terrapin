<script lang="tsx">
import { ComputedRef, defineComponent, reactive, toRefs } from 'vue';
import { useEvents, DialogEvents } from '~/composables';
import InputButton from '../input-button';
import InputTitle from '../input-title';

export default defineComponent({
  name: 'input-block',
  components: { InputButton, InputTitle },
  props: {},
  setup() {
    const state = reactive({ question: '' as string | (() => ComputedRef<string>), choices: [], validators: {} as Record<string, () => ComputedRef<boolean>> });
    const { onEvent, emitEvent } = useEvents();

    onEvent(DialogEvents.PROMPT, ({ question, choices, validators }) => {
      state.choices = choices;
      state.question = question;
      state.validators = validators;
    });

    function onClick(choice: string) {
      emitEvent(`${DialogEvents.PROMPT}-response`, { choice });
      state.question = '';
    }

    return { ...toRefs(state), onClick };
  },

  render() {
    if (!this.question) {
      return <div class="input-block input-block--nothing"></div>;
    }

    return (
      <div class="input-block">
        <input-title class="input-block__question" title={this.question}></input-title>
        <div class="input-block__choices">
          {this.choices.map((choice) => (
            //@ts-ignore
            <input-button class="input-block__choice" onClick={() => this.onClick(choice)} choice={choice} validator={this.validators?.[choice]}></input-button>
          ))}
        </div>
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.input-block {
  display: flex;

  width: 100%;
  height: 100%;

  background: white;

  flex-direction: column;
  justify-content: center;
}

.input-block--nothing {
  background: transparent;
}

.input-block__question {
  padding: 5px;
}

.input-block__choices {
  display: flex;
  width: 100%;

  column-gap: 10px;

  padding: 10px;
}

.input-block__choice {
  flex: 1;
}
</style>
