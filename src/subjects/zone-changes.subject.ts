import { Subject } from 'rxjs';
import { useGameState } from '~/composables';
import { ZoneType } from '~/models/zone.model';

const zoneChangesSubject = new Subject<{ newZone: ZoneType; cardIds: string[] }>();

zoneChangesSubject.subscribe(({ newZone, cardIds }) => {
  const { setMeta } = useGameState();
  if (newZone !== ZoneType.battlefield) {
    // clear states and counters
    cardIds.forEach((id) => setMeta(id, { isTapped: false }));
  }
});

export { zoneChangesSubject };
