import { createMachine, interpret, actions, RaiseAction } from 'xstate';
import { PhaseType, TurnPhase } from '~/models/phases.model';
import { setUpTransitions } from './shared';
import { phaseSubject } from '~/subjects';

const { raise } = actions;

export enum PhaseSteps {
  NEXT = 'NEXT',
}

interface PhaseContext {
  skipCombat: boolean;
}

const phaseState = createMachine({
  id: 'turn-phase',
  initial: 'initial',
  context: {
    skipCombat: false,
  } as PhaseContext,
  states: {
    initial: {
      on: {
        NEXT: 'uptap',
        END_TURN: 'end_turn',
      },
    },
    uptap: {
      on: {
        NEXT: 'upkeep',
        END_TURN: 'end_turn',
      },
      entry: [() => onStart(TurnPhase.UPTAP)],
      exit: [() => onEnd(TurnPhase.UPTAP)],
    },
    upkeep: {
      on: {
        NEXT: 'draw',
        END_TURN: 'end_turn',
      },
      entry: [() => onStart(TurnPhase.UPKEEP)],
      exit: [() => onEnd(TurnPhase.UPKEEP)],
    },
    draw: {
      on: {
        NEXT: 'main_one',
        END_TURN: 'end_turn',
      },
      entry: [() => onStart(TurnPhase.DRAW)],
      exit: [() => onEnd(TurnPhase.DRAW)],
    },
    main_one: {
      on: {
        NEXT: { target: 'combat' },
        END_TURN: 'end_turn',
      },
      entry: [() => onStart(TurnPhase.MAIN_ONE)],
      exit: [() => onEnd(TurnPhase.MAIN_ONE)],
    },
    combat: {
      on: {
        NEXT: 'attackers',
        END: 'end_combat',
        SKIP_COMBAT: { target: 'main_two' },
        END_TURN: 'end_turn',
      },
      entry: [() => onStart(TurnPhase.COMBAT)],
      exit: [() => onEnd(TurnPhase.COMBAT)],
    },
    attackers: {
      on: {
        NEXT: 'blockers',
        END_TURN: 'end_turn',
      },
      entry: [() => onStart(TurnPhase.DECLARE_ATTACKERS)],
      exit: [() => onEnd(TurnPhase.DECLARE_ATTACKERS)],
    },
    blockers: {
      on: {
        NEXT: 'dbl_damage',
        END_TURN: 'end_turn',
      },
      entry: [() => onStart(TurnPhase.DECLARE_BLOCKERS)],
      exit: [() => onEnd(TurnPhase.DECLARE_BLOCKERS)],
    },
    dbl_damage: {
      on: {
        NEXT: 'damage',
        END_TURN: 'end_turn',
      },
      entry: [() => onStart(TurnPhase.SPECIAL_DAMAGE)],
      exit: [() => onEnd(TurnPhase.SPECIAL_DAMAGE)],
    },
    damage: {
      on: {
        NEXT: 'end_combat',
        END_TURN: 'end_turn',
      },
      entry: [() => onStart(TurnPhase.DAMAGE)],
      exit: [() => onEnd(TurnPhase.DAMAGE)],
    },
    end_combat: {
      on: {
        NEXT: 'main_two',
        END_TURN: 'end_turn',
      },
      entry: [() => onStart(TurnPhase.END_COMBAT)],
      exit: [() => onEnd(TurnPhase.END_COMBAT)],
    },
    main_two: {
      on: {
        NEXT: 'end_turn',
        END_TURN: 'end_turn',
      },
      entry: [() => onStart(TurnPhase.MAIN_TWO)],
      exit: [() => onEnd(TurnPhase.MAIN_TWO)],
    },
    end_turn: {
      on: {
        NEXT: 'clean_up',
        END_TURN: 'clean_up',
      },
      entry: [() => onStart(TurnPhase.END_TURN)],
      exit: [() => onEnd(TurnPhase.END_TURN)],
    },
    clean_up: {
      on: {
        NEXT: 'uptap',
        END_TURN: 'uptap',
      },
      entry: [() => onStart(TurnPhase.CLEAN_UP)],
      exit: [() => onEnd(TurnPhase.CLEAN_UP)],
    },
  },
});

function startPhases() {
  const service = buildService();
  service.start();

  return service;
}

export { startPhases };

function buildService() {
  const phaseService = interpret(phaseState);

  setUpTransitions(phaseService, {});

  return phaseService;
}

function onStart(phase: TurnPhase) {
  phaseSubject.next({ type: PhaseType.START, phase });
}

function onEnd(phase: TurnPhase) {}
