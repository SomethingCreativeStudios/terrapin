import { createMachine, assign, interpret } from 'xstate';
import { useZone, useDialog, useEvents, usePhase, useUserAction, UserAction, useGameItems } from '~/composables';
import { ZoneType } from '~/models/zone.model';
import { setUpTransitions, StateContext, StateInterrupter } from './shared';
import { HandActions } from '~/actions';

export enum MulliganSteps {
  INITIAL__NEXT = 'NEXT',
  CHOICE__MULLIGAN = 'MULLIGAN',
  CHOICE__KEEP = 'KEEP',
  MULLIGAN__NEXT = 'NEXT',
  SEND_BACK__NEXT = 'NEXT',
}

interface MulliganContext {
  count: number;
}

const mulliganState = createMachine({
  id: 'hand-mulligan',
  initial: 'initial',
  context: {
    count: 0,
  } as MulliganContext,
  states: {
    initial: {
      on: { NEXT: 'choice' },
    },
    choice: {
      on: {
        MULLIGAN: 'mulligan',
        KEEP: [
          {
            target: 'sendBack',
            cond: (context) => context.count > 0,
          },
          { target: 'done', cond: (context) => context.count === 0 },
        ],
      },
    },
    mulligan: {
      on: {
        NEXT: {
          target: 'choice',
          actions: assign({ count: (context: any) => context.count + 1 }),
        },
      },
    },
    sendBack: {
      on: { NEXT: 'done' },
    },
    done: {
      type: 'final',
    },
  },
});

function startMulligan() {
  const { nextPhase } = usePhase();
  const { startAction, endAction } = useUserAction();
  const service = buildService();

  startAction(UserAction.MULLIGAN);

  service.onDone(() => {
    nextPhase();
    endAction(UserAction.MULLIGAN);
  });

  service.start();
}

export { startMulligan };

function buildService() {
  const mulliganService = interpret(mulliganState);

  setUpTransitions(mulliganService, {
    'start->initial': onMulligan,
    'initial->choice': onChoice,
    'choice->mulligan': onMulligan,
    'mulligan->choice': onChoice,
    'choice->sendBack': onSendBack,
  });

  return mulliganService;
}

function onMulligan(_: StateContext<MulliganContext>, service: StateInterrupter<MulliganContext>) {
  //Should just be restart game
  HandActions.shuffleHandIntoDeck();

  HandActions.drawHand();
  service.send(MulliganSteps.INITIAL__NEXT);
}

async function onChoice(state: StateContext<MulliganContext>, service: StateInterrupter<MulliganContext>) {
  const { askQuestion, toChoice } = useDialog();
  const numberOfMulligans = state.context.count;

  const isFirst = numberOfMulligans === 0 ? '' : `<br> You will need to send ${numberOfMulligans} back`;
  const choice = await askQuestion(`Do you want to keep this hand?${isFirst}`, toChoice<string>(['Keep', 'Mulligan']));

  if (choice.value === 'Keep') {
    service.send(MulliganSteps.CHOICE__KEEP);
  } else {
    service.send(MulliganSteps.CHOICE__MULLIGAN);
  }
}

async function onSendBack(state: StateContext<MulliganContext>, service: StateInterrupter<MulliganContext>) {
  const { getCardsInZone } = useZone();
  const { getCardById } = useGameItems();
  const { selectFrom } = useDialog();

  const numberOfMulligans = state.context.count;
  const idsInHand = getCardsInZone(ZoneType.hand);
  const cardsInHand = idsInHand.value.map((id) => getCardById(id).value?.baseCard);

  HandActions.sendToBottom(
    await selectFrom({
      cards: cardsInHand,
      currentZone: ZoneType.hand,
      height: '371px',
      title: `Pick ${numberOfMulligans} to send back: `,
      min: numberOfMulligans,
      max: numberOfMulligans,
      dialogGroup: 'mulligan',
    })
  );

  service.send(MulliganSteps.SEND_BACK__NEXT);
}
