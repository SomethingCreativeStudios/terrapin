import { onUnmounted, readonly } from 'vue';
import { EventEmitter } from '~/models/event-emitter.model';

const eventBus = new EventEmitter();

function setUp() {
  onUnmounted(() => {
    eventBus.cleanUp();
  });
}

function emitEvent(name: string, payload: any) {
  eventBus.emit(name, payload);
}

function onEvent(name: string, cb: (data: any) => void) {
  eventBus.listen(name, cb);
}

export function useEvents() {
  return { setUp, emitEvent, onEvent };
}
