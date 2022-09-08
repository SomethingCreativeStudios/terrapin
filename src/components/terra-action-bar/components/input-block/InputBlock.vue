<script lang="tsx">
import { defineComponent, reactive, toRefs } from 'vue';
import { useEvents, DialogEvents } from '~/composables';

export default defineComponent({
  name: 'input-block',
  components: {},
  props: {},
  setup() {
    const state = reactive({ question: '', choices: [] });
    const { onEvent, emitEvent } = useEvents();

    onEvent(DialogEvents.PROMPT, ({ question, choices }) => {
      state.choices = choices;
      state.question = question;
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
        <div class="input-block__question" v-html={this.question}></div>
        <div class="input-block__choices">
          {this.choices.map((choice) => (
            <button class="input-block__choice" onClick={() => this.onClick(choice)}>
              {choice}
            </button>
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
