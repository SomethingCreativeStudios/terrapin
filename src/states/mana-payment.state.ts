import { clone } from 'ramda';
import { createMachine, interpret } from 'xstate';
import { PaymentActions } from '~/actions';
import { useZone, useDialog, useGameItems, UserAction, useGameTracker, useUserAction, useStack } from '~/composables';
import { Card, CardPosition, ManaCost } from '~/models/card.model';
import { NumberPromptDialogModel } from '~/models/dialog.model';
import { ZoneType } from '~/models/zone.model';
import { setUpTransitions, StateContext, StateInterrupter } from './shared';

enum ManaPaymentActions {
  NEXT = 'NEXT',
  HAS_ALTERNATIVE = 'HAS-ALT',
  PAY_ALTERNATIVE_COSTS = 'pay-alternative-costs',
  PAID_ALTERNATIVE_COSTS = 'paid-alternative-costs',
  HAS_VARIABLE_COSTS = 'has-variable-costs',
  PAID_VARIABLE_COSTS = 'paid-variable-costs',
}

enum ManaPaymentSteps {
  INITIAL = 'initial',
  STACK = 'stack',
  MODAL = 'modal',
  DONE = 'done',
  PAY_ALTERNATIVE_COSTS = 'pay-alternative-costs',
  PAY_VARIABLE_COSTS = 'pay-variable-costs',
  PAY_PHYREXIAN_COSTS = 'pay-phyrexian-costs',
  PICK_TARGETS = 'pick-targets',
  CHECK_LEGALITY = 'check-legality',
  CAST_SPELL = 'cast-spell',
}

interface ManaPaymentContext {
  card: Card;
  options: CastingOptions;
  startingZone: ZoneType;
  prompt: {
    xValue?: number;
  };
}

export interface CastingOptions {
  cardPos?: CardPosition;
  castingCost?: ManaCost;
  skipAuto?: boolean;
}

const manaPayment = createMachine({
  id: 'mana-payment',
  initial: 'initial',
  context: {
    card: {},
    prompt: {},
  } as ManaPaymentContext,
  states: {
    [ManaPaymentSteps.INITIAL]: {
      on: { [ManaPaymentActions.NEXT]: ManaPaymentSteps.STACK },
    },
    [ManaPaymentSteps.STACK]: {
      on: { [ManaPaymentActions.NEXT]: ManaPaymentSteps.MODAL },
    },
    [ManaPaymentSteps.MODAL]: {
      on: { [ManaPaymentActions.NEXT]: ManaPaymentSteps.PAY_ALTERNATIVE_COSTS },
    },
    [ManaPaymentSteps.PAY_ALTERNATIVE_COSTS]: {
      on: {
        [ManaPaymentActions.NEXT]: {
          target: ManaPaymentSteps.PAY_VARIABLE_COSTS,
        },
      },
    },
    [ManaPaymentSteps.PAY_VARIABLE_COSTS]: {
      on: {
        [ManaPaymentActions.NEXT]: {
          target: ManaPaymentSteps.PAY_PHYREXIAN_COSTS,
        },
      },
    },
    [ManaPaymentSteps.PAY_PHYREXIAN_COSTS]: {
      on: {
        [ManaPaymentActions.NEXT]: {
          target: ManaPaymentSteps.PICK_TARGETS,
        },
      },
    },
    [ManaPaymentSteps.PICK_TARGETS]: {
      on: {
        [ManaPaymentActions.NEXT]: {
          target: ManaPaymentSteps.CHECK_LEGALITY,
        },
      },
    },
    [ManaPaymentSteps.CHECK_LEGALITY]: {
      on: {
        [ManaPaymentActions.NEXT]: {
          target: ManaPaymentSteps.CAST_SPELL,
        },
      },
    },
    [ManaPaymentSteps.CAST_SPELL]: {
      on: {
        [ManaPaymentActions.NEXT]: {
          target: ManaPaymentSteps.DONE,
        },
      },
    },
    [ManaPaymentSteps.DONE]: {
      type: 'final',
    },
  },
});

async function castSpell(card: Card, options?: CastingOptions) {
  const { getCardById } = useGameItems();
  const state = getCardById(card.cardId).value;
  const service = buildService(card, options);

  service.start();
}

function buildService(card: Card, options?: CastingOptions) {
  const { findZoneNameFromCard } = useZone();

  const castService = interpret(clone(manaPayment));
  castService.machine.context.card = card;
  castService.machine.context.options = options ?? {};
  castService.machine.context.startingZone = findZoneNameFromCard(card.cardId);

  setUpTransitions(castService, {
    [makeTransitionString('start', ManaPaymentSteps.INITIAL)]: (_: any, service: StateInterrupter<ManaPaymentContext>) => service.send(ManaPaymentActions.NEXT),
    [makeTransitionString(ManaPaymentSteps.INITIAL, ManaPaymentSteps.STACK)]: moveToStack,
    [makeTransitionString(ManaPaymentSteps.STACK, ManaPaymentSteps.MODAL)]: pickModalSide,
    [makeTransitionString(ManaPaymentSteps.MODAL, ManaPaymentSteps.PAY_ALTERNATIVE_COSTS)]: payAlternativeCosts,
    [makeTransitionString(ManaPaymentSteps.PAY_ALTERNATIVE_COSTS, ManaPaymentSteps.PAY_VARIABLE_COSTS)]: payVariableCosts,
    [makeTransitionString(ManaPaymentSteps.PAY_VARIABLE_COSTS, ManaPaymentSteps.PAY_PHYREXIAN_COSTS)]: payPhyrexianCosts,
    [makeTransitionString(ManaPaymentSteps.PAY_PHYREXIAN_COSTS, ManaPaymentSteps.PICK_TARGETS)]: resolveTargets,
    [makeTransitionString(ManaPaymentSteps.PICK_TARGETS, ManaPaymentSteps.CHECK_LEGALITY)]: tempNext,
    [makeTransitionString(ManaPaymentSteps.CHECK_LEGALITY, ManaPaymentSteps.CAST_SPELL)]: payForSpell,
  });

  return castService;
}

function tempNext(_: StateContext<ManaPaymentContext>, service: StateInterrupter<ManaPaymentContext>) {
  service.send(ManaPaymentActions.NEXT);
}

function moveToStack(state: StateContext<ManaPaymentContext>, service: StateInterrupter<ManaPaymentContext>) {
  const { moveCard, findZoneNameFromCard } = useZone();

  moveCard(findZoneNameFromCard(state.context.card.cardId), ZoneType.stack, state.context.card.cardId);
  service.send(ManaPaymentActions.NEXT);
}

function pickModalSide(_: StateContext<ManaPaymentContext>, service: StateInterrupter<ManaPaymentContext>) {
  service.send(ManaPaymentActions.NEXT);
}

function payAlternativeCosts(_: StateContext<ManaPaymentContext>, service: StateInterrupter<ManaPaymentContext>) {
  // Do Later
  service.send(ManaPaymentActions.NEXT);
}

async function payVariableCosts(ctx: StateContext<ManaPaymentContext>, service: StateInterrupter<ManaPaymentContext>) {
  const card = ctx.context.card;

  if (card.manaCost.hasX) {
    const { promptUser } = useDialog();
    const xValue = await promptUser({ question: "What is the value of 'X'", responseType: 'Number' } as NumberPromptDialogModel);
    ctx.context.prompt.xValue = xValue as number;
  }

  service.send(ManaPaymentActions.NEXT);
}

function payPhyrexianCosts(_: StateContext<ManaPaymentContext>, service: StateInterrupter<ManaPaymentContext>) {
  // Do Later
  service.send(ManaPaymentActions.NEXT);
}

function resolveTargets(_: StateContext<ManaPaymentContext>, service: StateInterrupter<ManaPaymentContext>) {
  // Do Later
  service.send(ManaPaymentActions.NEXT);
}

async function payForSpell(ctx: StateContext<ManaPaymentContext>, service: StateInterrupter<ManaPaymentContext>) {
  const { moveCard } = useZone();
  const { canPlayLand, addLandsPlayed } = useGameTracker();
  const { setCardById } = useGameItems();
  const { startAction, endAction } = useUserAction();
  const { addToStack } = useStack();

  const card = ctx.context.card;

  if (card.cardTypes.includes('Land')) {
    if (!canPlayLand().value) {
      moveCard(ZoneType.stack, ctx.context.startingZone, ctx.context.card.cardId);
      service.send(ManaPaymentActions.NEXT);
      return;
    }

    setCardById(card.cardId, { position: ctx.context.options?.cardPos });
    moveCard(ZoneType.stack, ZoneType.battlefield, ctx.context.card.cardId);
    service.send(ManaPaymentActions.NEXT);
    addLandsPlayed();
    return;
  }

  startAction(UserAction.PAYING_MANA);

  const wasPaid = await PaymentActions.wasPaid(card.cardId);

  if (wasPaid) {
    await addToStack({ id: card.cardId, type: 'SPELL', position: ctx.context.options?.cardPos });
  }

  if (!wasPaid) {
    moveCard(ZoneType.stack, ctx.context.startingZone, ctx.context.card.cardId);
  }

  endAction(UserAction.PAYING_MANA);
  service.send(ManaPaymentActions.NEXT);
}

function makeTransitionString(...args: string[]) {
  return args.join('->');
}

export { castSpell };
