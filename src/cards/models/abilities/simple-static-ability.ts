import { ZoneType } from '~/models/zone.model';
import { Effect } from '../effects/effect';
import { StaticAbility } from './static-ability';

export class SimpleStaticAbility extends StaticAbility {
  constructor(cardId: string, effects: Effect[], zones = [ZoneType.battlefield]) {
    super(cardId, effects, zones);
  }
}
