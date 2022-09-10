<script lang="tsx">
import { defineComponent } from 'vue';
import { ManaType } from '~/models/card.model';
import { ManaSymbol } from './components';

export default defineComponent({
  name: 'mana-tracker',
  components: { ManaSymbol },
  props: {},
  setup() {},

  render() {
    return (
      <div class="mana-tracker">
        <mana-symbol manaType={ManaType.WHITE}></mana-symbol>
        <mana-symbol manaType={ManaType.BLUE}></mana-symbol>
        <mana-symbol manaType={ManaType.BLACK}></mana-symbol>
        <mana-symbol manaType={ManaType.RED}></mana-symbol>
        <mana-symbol manaType={ManaType.GREEN}></mana-symbol>
        <mana-symbol manaType={ManaType.COLORLESS}></mana-symbol>
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.mana-tracker {
  display: flex;

  width: fit-content;
  height: fit-content;

  color: white;

  column-gap: 20px;
}
</style>
