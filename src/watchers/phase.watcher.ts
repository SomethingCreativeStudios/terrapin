import { Subject } from 'rxjs';
import { PhaseType, TurnPhase } from '~/models/phases.model';
import { DeckActions } from '~/actions';

const phaseSubject = new Subject<{ type: PhaseType; phase: TurnPhase }>();

phaseSubject.subscribe(({ type, phase }) => {
  if (type === PhaseType.START && phase === TurnPhase.DRAW) {
    DeckActions.DrawXCards(1);
  }
});

export { phaseSubject };
