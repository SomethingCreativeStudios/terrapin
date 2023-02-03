import { Card } from '~/models/card.model';
import { Watcher } from '../watchers/watcher';
import { Effect } from './effect';

export class WatcherEffect extends Effect {
  constructor(card: Card, private watcher: Watcher) {
    super(card);
  }

  async do(): Promise<void> {
    this.watcher.watch();
  }
}
