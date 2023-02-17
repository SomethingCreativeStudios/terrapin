import { Subject } from 'rxjs';
import { useGameItems } from '~/composables';
import { ZoneType } from '~/models/zone.model';

const zoneChangesSubject = new Subject<{ newZone: ZoneType; cardIds: string[] }>();

zoneChangesSubject.subscribe(({ newZone, cardIds }) => {
  const { setCardsByIds } = useGameItems();
  if (newZone !== ZoneType.battlefield) {
    setCardsByIds(cardIds, { isTapped: false });
  }
});

export { zoneChangesSubject };
