import { reactive } from 'vue';
import { Interpreter, AnyEventObject, ResolveTypegenMeta, TypegenDisabled, BaseActionObject, ServiceMap, InterpreterStatus } from 'xstate';
import { PhaseType, TurnPhase } from '~/models/phases.model';
import { startPhases } from '~/states/phase.state';
import { startPriority } from '~/states/priority.state';
import { phaseSubject, prioritySubject } from '~/subjects';

type PhaseState = Interpreter<
  any,
  any,
  AnyEventObject,
  {
    value: any;
    context: any;
  },
  ResolveTypegenMeta<TypegenDisabled, AnyEventObject, BaseActionObject, ServiceMap>
>;

type PriorityState = Interpreter<
  any,
  any,
  AnyEventObject,
  {
    value: any;
    context: any;
  },
  TypegenDisabled
>;

const state = reactive({
  activePhase: TurnPhase.NOTHING,
  phaseState: {} as PhaseState,
  priorityState: {} as PriorityState,
});

function setUp() {
  state.phaseState = startPhases();
  state.priorityState = startPriority();

  phaseSubject.subscribe(async ({ type, phase }) => {
    state.activePhase = phase;

    if (type === PhaseType.END) {
      //await waitForPriority();
      nextState();
    }
  });
}

function nextPhase() {
  phaseSubject.next({ type: PhaseType.END, phase: state.activePhase });
}

function passPriority() {
  state.priorityState.send('NEXT');
}

function waitForPriority() {
  if (state.priorityState.status === InterpreterStatus.Stopped) {
    state.priorityState.start();
  }

  state.priorityState.send('NEXT');

  return new Promise((resolve) => {
    const sub = prioritySubject.subscribe(({ end }) => {
      if (end) {
        sub.unsubscribe();
        resolve(null);
      }
    });
  });
}

function skipCombat() {
  if (state.activePhase !== TurnPhase.COMBAT) return;
  state.phaseState.send('SKIP_COMBAT');
}

function endTurn() {
  state.phaseState.send('END_TURN');
  nextPhase();
  nextPhase();
}

export function usePhase() {
  return { setUp, nextPhase, passPriority, skipCombat, endTurn, waitForPriority};
}

function nextState() {
  if (state.phaseState.status === InterpreterStatus.NotStarted) {
    state.phaseState.start();
  }

  state.phaseState.send('NEXT');
}
