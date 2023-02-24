import { Subject } from 'rxjs';
import { EventType } from '~/cards/models/game-event';
import { PhaseType, TurnPhase } from '~/models/phases.model';
import { ZoneType } from '~/models/zone.model';
import { eventSubject } from '~/subjects';

const phaseSubject = new Subject<{ type: PhaseType; phase: TurnPhase }>();

phaseSubject.subscribe(({ phase, type }) => {
  if (type === PhaseType.START) {
    switch (phase) {
      case TurnPhase.UPTAP:
        sendEvent(EventType.UNTAP_STEP_PRE);
        break;

      case TurnPhase.UPKEEP:
        sendEvent(EventType.UPKEEP_STEP_PRE);
        break;

      case TurnPhase.DRAW:
        sendEvent(EventType.DRAW_STEP_PRE);
        break;

      case TurnPhase.MAIN_ONE:
        sendEvent(EventType.PRECOMBAT_MAIN_PHASE_PRE);
        break;

      case TurnPhase.COMBAT:
        sendEvent(EventType.COMBAT_PHASE_PRE);
        break;

      case TurnPhase.DECLARE_ATTACKERS:
        sendEvent(EventType.DECLARE_ATTACKERS_STEP_PRE);
        break;

      case TurnPhase.DECLARE_BLOCKERS:
        sendEvent(EventType.DECLARE_BLOCKERS_STEP_PRE);
        break;

      case TurnPhase.DAMAGE:
        sendEvent(EventType.COMBAT_DAMAGE_STEP_PRE);
        break;

      case TurnPhase.END_COMBAT:
        sendEvent(EventType.END_COMBAT_STEP_PRE);
        break;

      case TurnPhase.MAIN_TWO:
        sendEvent(EventType.POSTCOMBAT_MAIN_PHASE_PRE);
        break;

      case TurnPhase.END_TURN:
        sendEvent(EventType.END_TURN_STEP_PRE);
        break;

      case TurnPhase.CLEAN_UP:
        sendEvent(EventType.CLEANUP_STEP_PRE);
        break;

      default:
        break;
    }
  }

  if (type === PhaseType.END) {
    switch (phase) {
      case TurnPhase.UPTAP:
        sendEvent(EventType.UNTAP_STEP_POST);
        break;

      case TurnPhase.UPKEEP:
        sendEvent(EventType.UPKEEP_STEP_POST);
        break;

      case TurnPhase.DRAW:
        sendEvent(EventType.DRAW_STEP_POST);
        break;

      case TurnPhase.MAIN_ONE:
        sendEvent(EventType.PRECOMBAT_MAIN_PHASE_POST);
        break;

      case TurnPhase.COMBAT:
        sendEvent(EventType.COMBAT_PHASE_POST);
        break;

      case TurnPhase.DECLARE_ATTACKERS:
        sendEvent(EventType.DECLARE_ATTACKERS_STEP_POST);
        break;

      case TurnPhase.DECLARE_BLOCKERS:
        sendEvent(EventType.DECLARE_BLOCKERS_STEP_POST);
        break;

      case TurnPhase.DAMAGE:
        sendEvent(EventType.COMBAT_DAMAGE_STEP_POST);
        break;

      case TurnPhase.END_COMBAT:
        sendEvent(EventType.END_COMBAT_STEP_POST);
        break;

      case TurnPhase.MAIN_TWO:
        sendEvent(EventType.POSTCOMBAT_MAIN_PHASE_POST);
        break;

      case TurnPhase.END_TURN:
        sendEvent(EventType.END_TURN_STEP_POST);
        break;

      case TurnPhase.CLEAN_UP:
        sendEvent(EventType.CLEANUP_STEP_POST);
        break;

      default:
        break;
    }
  }
});

function sendEvent(type: EventType) {
  eventSubject.next({ sourceId: '', sourceZone: ZoneType.none, type });
}

export { phaseSubject };
