<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { PhaseType, TurnPhase } from '~/models/phases.model';
import { phaseSubject } from '~/watchers/phase.watcher';
import { useGameState } from '~/composables';

const { nextPhase } = useGameState();

export default defineComponent({
  name: 'phase-tracker',
  components: {},
  props: {},
  setup() {
    const phase = ref(TurnPhase.NOTHING);

    phaseSubject.subscribe(({ phase: turnPhase, type }) => {
      if (type === PhaseType.START) {
        phase.value = turnPhase;
      }
    });

    return { phase };
  },

  render() {
    const makePhaseCounter = (phase: TurnPhase) => (
      <div class={`phase-tracker__phase ${phase === this.phase ? 'phase-tracker__phase--active' : ''}`} onClick={nextPhase}>
        {phase}
      </div>
    );

    const makeSubBlock = (phases: TurnPhase[]) => {
      const [first, ...rest] = phases;
      const showFirst = !phases.includes(this.phase);

      return (
        <div class="phase-tracker__phase phase-tracker__block">
          <div
            class={`phase-tracker__block--item ${showFirst ? 'phase-tracker__phase--show' : ''} ${first === this.phase ? 'phase-tracker__phase--active' : ''}`}
            onClick={nextPhase}
          >
            {first}
          </div>

          {rest.map((phase) => (
            <div class={`phase-tracker__block--item ${phase === this.phase ? 'phase-tracker__phase--active' : ''}`} onClick={nextPhase}>
              {phase}
            </div>
          ))}
        </div>
      );
    };
    return (
      <div class="phase-tracker">
        {makePhaseCounter(TurnPhase.UPTAP)}
        {makePhaseCounter(TurnPhase.UPKEEP)}
        {makePhaseCounter(TurnPhase.DRAW)}
        {makePhaseCounter(TurnPhase.MAIN_ONE)}
        {makeSubBlock([TurnPhase.COMBAT, TurnPhase.DECLARE_ATTACKERS, TurnPhase.DECLARE_BLOCKERS, TurnPhase.SPECIAL_DAMAGE, TurnPhase.DAMAGE, TurnPhase.END_COMBAT])}
        {makePhaseCounter(TurnPhase.MAIN_TWO)}
        {makePhaseCounter(TurnPhase.END_TURN)}
        {makePhaseCounter(TurnPhase.CLEAN_UP)}
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.phase-tracker {
  width: 100%;
  height: 30px;
  display: flex;
  column-gap: 10px;
}

.phase-tracker__block--item,
.phase-tracker__phase {
  color: white;
  text-transform: uppercase;
  text-align: center;
  height: 100%;
  width: 100%;
  cursor: pointer;
}

.phase-tracker__phase--active {
  color: yellow;
  text-shadow: #fc0 1px 0 10px;
}

.phase-tracker__block {
  position: relative;
  .phase-tracker__block--item {
    position: absolute;
    visibility: hidden;
  }

  .phase-tracker__phase--show,
  .phase-tracker__phase--active {
    visibility: visible;
  }
}
</style>
