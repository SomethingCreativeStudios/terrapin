import { createMachine, interpret } from 'xstate';
import { PaymentActions } from '~/actions';
import { useZone, useDialog, useGameState, UserAction } from '~/composables';
import { Card, ManaCost } from '~/models/card.model';
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
  castingCost?: ManaCost;
  prompt: {
    xValue?: number;
  };
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

function castSpell(card: Card, castingCost?: ManaCost) {
  const service = buildService(card, castingCost);
  service.start();
}

function buildService(card: Card, castingCost?: ManaCost) {
  const castService = interpret(manaPayment);
  castService.machine.context.card = card;
  castService.machine.context.castingCost = castingCost;

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
  const { addCardToZone } = useZone();

  addCardToZone(ZoneType.stack, state.context.card.cardId);
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
  const { moveCard, removeCardInZone } = useZone();
  const { setUserAction } = useGameState();
  const card = ctx.context.card;

  if (card.cardTypes.includes('Land')) {
    moveCard(ZoneType.hand, ZoneType.battlefield, ctx.context.card.cardId);
    service.send(ManaPaymentActions.NEXT);
    return;
  }

  setUserAction(UserAction.PAYING_MANA);

  const wasPaid = await PaymentActions.wasPaid(ctx.context.castingCost || card.manaCost);

  const isSpell = ctx.context.card.cardTypes.includes('Instant') || ctx.context.card.cardTypes.includes('Sorcery');

  if (wasPaid && !isSpell) {
    moveCard(ZoneType.hand, ZoneType.battlefield, ctx.context.card.cardId);
  } else if (wasPaid) {
    const { getMeta } = useGameState();
    const cardState = getMeta(ctx.context.card.cardId);

    cardState.value.cardClass.abilities.forEach((ability) => {
      if (ability.canDo()) ability.do();
    });

    moveCard(ZoneType.hand, ZoneType.graveyard, ctx.context.card.cardId);
  }

  service.send(ManaPaymentActions.NEXT);
  setUserAction(UserAction.NOTHING);
  removeCardInZone(ZoneType.stack, card.cardId);
}

function makeTransitionString(...args: string[]) {
  return args.join('->');
}

export { castSpell };
