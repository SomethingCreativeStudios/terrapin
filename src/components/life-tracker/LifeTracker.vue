<script lang="tsx">
import { defineComponent } from 'vue';
import { TrackerActions } from '~/actions';
import { useGameTracker } from '~/composables';

export default defineComponent({
  name: 'life-tracker',
  components: {},
  props: {},
  setup() {
    const { getLifeCount, getTurnCount } = useGameTracker();

    return { lifeCount: getLifeCount(), turnCount: getTurnCount() };
  },
  render() {
    return (
      <div class="life-tracker">
        <div class="life-tracker__turn-count">Turn: {this.turnCount}</div>
        <div class="life-tracker__button" onClick={() => TrackerActions.takeDamage(1)}>
          -
        </div>
        <div class="life-tracker__life">{this.lifeCount}</div>
        <div class="life-tracker__button" onClick={() => TrackerActions.gainLife(1)}>
          +
        </div>
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.life-tracker {
  display: flex;

  width: fit-content;
  height: fit-content;

  color: white;

  column-gap: 10px;

  font-size: 24px;
}

.life-tracker__turn-count {
  padding-right: 10px;
}

.life-tracker__button:hover {
  cursor: pointer;
}
</style>
