import { CardPosition } from '~/models/card.model';
import { ZoneType } from '~/models/zone.model';

export interface StackItem {
  id: string;
  type: 'SPELL' | 'ABILITY';
  position?: CardPosition;
  zone?: ZoneType;
}
