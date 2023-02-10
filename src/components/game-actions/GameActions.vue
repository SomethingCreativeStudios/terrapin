<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { usePhase } from '~/composables';
import { PhaseType, TurnPhase } from '~/models/phases.model';
import { prioritySubject, phaseSubject } from '~/subjects';

const { passPriority, skipCombat, endTurn } = usePhase();

export default defineComponent({
  name: 'game-actions',
  components: {},
  props: {},
  setup() {
    const showPriority = ref(false);
    const showSkipCombat = ref(false);

    prioritySubject.subscribe(({ player, end }) => {
      if (!end && player === 'PLAYER_1') {
        showPriority.value = true;
      } else {
        showPriority.value = false;
      }
    });

    phaseSubject.subscribe(({ phase, type }) => {
      if (type === PhaseType.START && phase === TurnPhase.COMBAT) {
        showSkipCombat.value = true;
      }

      if (type === PhaseType.START && phase === TurnPhase.MAIN_TWO) {
        showSkipCombat.value = false;
      }
    });

    return { showPriority, showSkipCombat };
  },

  render() {
    return (
      <div class="game-actions">
        {this.showPriority ? (
          <button type="button" class="btn-action" onClick={passPriority}>
            Pass Priority
          </button>
        ) : null}
        {this.showSkipCombat ? (
          <button type="button" class="btn-action" onClick={skipCombat}>
            Skip Combat
          </button>
        ) : null}
        <button type="button" class="btn-action" onClick={endTurn}>
          End Turn
        </button>
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.game-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.btn-action {
  font-size: 20px;
}
</style>
