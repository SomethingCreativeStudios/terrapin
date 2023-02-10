import { createMachine, interpret } from 'xstate';
import { prioritySubject } from '~/subjects';

function startPriority() {
  const players = ['PLAYER_1'];

  const steps = players.reduce(
    (acc, player, index) => ({
      ...acc,
      [player]: {
        on: {
          NEXT: index + 1 < players.length ? players[index + 1] : 'initial',
        },
        entry: [() => prioritySubject.next({ player, end: false })],
      },
    }),
    {} as any
  );

  const priorityState = createMachine({
    id: 'priority-tracker',
    initial: 'initial',
    context: {},
    states: {
      initial: {
        on: {
          NEXT: players[0],
        },
      },
      ...steps,
    },
  });

  const service = buildService(priorityState);

  service.onTransition((state) => {
    if (state.value === 'initial') {
      prioritySubject.next({ player: 'DONE', end: true });
    }
  });

  service.onDone(() => {
    prioritySubject.next({ player: 'DONE', end: true });
  });

  service.start();

  return service;
}

function buildService(state: any) {
  const service = interpret(state);

  return service;
}

export { startPriority };
