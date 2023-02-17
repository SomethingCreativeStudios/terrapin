import { Subject } from 'rxjs';
import { PhaseType, TurnPhase } from '~/models/phases.model';

const phaseSubject = new Subject<{ type: PhaseType; phase: TurnPhase }>();

export { phaseSubject };
