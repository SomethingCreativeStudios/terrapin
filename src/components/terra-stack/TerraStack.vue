<script lang="tsx">
import { defineComponent, computed, PropType } from 'vue';
import TerraDialog from '~/components/dialogs/terra-dialog';
import { useStack, useGameItems } from '~/composables';
import { PromptDialogModel } from '~/models/dialog.model';

export default defineComponent({
  name: 'terra-stack',
  components: { TerraDialog },
  props: {
    dialog: {
      type: Object as PropType<PromptDialogModel>,
      default: () => {},
    },
  },
  setup() {
    const items = computed(() => {
      const { getCardById, getAbilityById } = useGameItems();
      const { getStack } = useStack();

      return getStack().value.map((item) => {
        const card = item.type === 'SPELL' ? getCardById(item.id).value.baseCard : getAbilityById(item.id).value.getCardState().baseCard;

        return { image: card.imagePath, type: item.type };
      });
    });

    // @ts-ignore
    return { stack: items };
  },

  render() {
    if (this.stack?.length === 0) {
      return <div class="terra-stack"></div>;
    }

    return (
      <div class="terra-stack">
        <terra-dialog group={this.dialog.dialogGroup} defaults={{ y: 50, x: 344, width: 1355, height: 288 }}>
          {{
            header: () => <div></div>,
            body: () => (
              <div class="stack-section">
                {this.stack.map((stack) => (
                  <div class={`terra-card__image terra-card__image--${stack.type}`}>
                    <img src={stack.image} />
                  </div>
                ))}
              </div>
            ),
            footer: () => <div></div>,
          }}
        </terra-dialog>
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.terra-stack {
  width: 100%;
  height: 100%;
}

.stack-section {
  display: flex;

  width: max-content;
  height: 100%;
}

.terra-card__image {
  object-fit: cover;
  padding: 10px;

  img {
    width: 100%;
    height: 100%;
  }
}

.terra-stack ::v-deep {
  .modal-body {
    overflow-x: auto;
    overflow-y: hidden;
  }
}
</style>
