import { Subject } from 'rxjs';
import { ZoneType } from '~/models/zone.model';
import { Card } from '~/models/card.model';

const zoneChangesSubject = new Subject<{ newZone: ZoneType; cardIds: string[] }>();

export { zoneChangesSubject };
