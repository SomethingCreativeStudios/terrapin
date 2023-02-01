import { createMachine, assign, interpret, actions, RaiseAction } from 'xstate';
import { TurnPhase } from '~/models/phases.model';
import { setUpTransitions, StateContext, StateInterrupter } from './shared';

const { raise } = actions;

export enum PhaseSteps {
  NEXT = 'NEXT',
}

interface PhaseContext {
  skipCombat: boolean;
}

const phaseState = createMachine({
  id: 'turn-phase',
  initial: 'uptap',
  context: {
    skipCombat: false,
  } as PhaseContext,
  states: {
    uptap: {
      on: { '': 'upkeep' },
      entry: [() => onStart(TurnPhase.UPTAP)],
      exit: [() => onEnd(TurnPhase.UPTAP)],
    },
    upkeep: {
      on: {
        NEXT: 'draw',
      },
      entry: [() => onStart(TurnPhase.UPKEEP)],
      exit: [() => onEnd(TurnPhase.UPKEEP)],
    },
    draw: {
      on: {
        NEXT: 'main_one',
      },
      entry: [() => onStart(TurnPhase.DRAW)],
      exit: [() => onEnd(TurnPhase.DRAW)],
    },
    main_one: {
      on: {
        NEXT: { target: 'combat' },
        SKIP_COMBAT: { target: 'combat', actions: raise('END') as RaiseAction<{ type: 'END' }> },
      },
      entry: [() => onStart(TurnPhase.MAIN_ONE)],
      exit: [() => onEnd(TurnPhase.MAIN_ONE)],
    },
    combat: {
      on: {
        NEXT: 'attackers',
        END: 'end_combat',
      },
      entry: [() => onStart(TurnPhase.COMBAT)],
      exit: [() => onEnd(TurnPhase.COMBAT)],
    },
    attackers: {
      on: {
        NEXT: 'blockers',
      },
      entry: [() => onStart(TurnPhase.DECLARE_ATTACKERS)],
      exit: [() => onEnd(TurnPhase.DECLARE_ATTACKERS)],
    },
    blockers: {
      on: {
        NEXT: 'dbl_damage',
      },
      entry: [() => onStart(TurnPhase.DECLARE_BLOCKERS)],
      exit: [() => onEnd(TurnPhase.DECLARE_BLOCKERS)],
    },
    dbl_damage: {
      on: {
        NEXT: 'damage',
      },
      entry: [() => onStart(TurnPhase.SPECIAL_DAMAGE)],
      exit: [() => onEnd(TurnPhase.SPECIAL_DAMAGE)],
    },
    damage: {
      on: {
        NEXT: 'damage',
      },
      entry: [() => onStart(TurnPhase.DAMAGE)],
      exit: [() => onEnd(TurnPhase.DAMAGE)],
    },
    end_combat: {
      on: {
        NEXT: 'main_two',
      },
      entry: [() => onStart(TurnPhase.END_COMBAT)],
      exit: [() => onEnd(TurnPhase.END_COMBAT)],
    },
    main_two: {
      on: {
        NEXT: 'end_turn',
      },
      entry: [() => onStart(TurnPhase.MAIN_TWO)],
      exit: [() => onEnd(TurnPhase.MAIN_TWO)],
    },
    end_turn: {
      on: {
        '': 'end_turn',
      },
      entry: [() => onStart(TurnPhase.END_TURN)],
      exit: [() => onEnd(TurnPhase.END_TURN)],
    },
    clean_up: {
      on: {
        NEXT: 'uptap',
      },
      entry: [() => onStart(TurnPhase.CLEAN_UP)],
      exit: [() => onEnd(TurnPhase.CLEAN_UP)],
    },
  },
});

function startPhases() {
  const service = buildService();
  service.start();
}

export { startPhases };

function buildService() {
  const phaseService = interpret(phaseState);

  setUpTransitions(phaseService, {});

  return phaseService;
}

function onStart(phase: TurnPhase) {
  console.log('On Start', phase);
}

function onEnd(phase: TurnPhase) {
  console.log('On end', phase);
}
