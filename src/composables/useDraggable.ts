import interact from 'interactjs';
import { onMounted, onUnmounted, ref } from 'vue';
import { CardPosition } from '~/models/card.model';
import { EventEmitter } from '~/models/event-emitter.model';

export enum DraggableEvents {
  ON_POSITION_MOVE = 'on-position',
}

function setup(initialPosition?: CardPosition) {
  const draggable = ref(null);
  const position = ref({ x: 0, y: 0 });
  const draggableEvents = new EventEmitter();

  onUnmounted(() => {
    draggableEvents.cleanUp();
  });

  onMounted(() => {
    if (!draggable.value) return;

    if (initialPosition) {
      position.value.x = initialPosition.x;
      position.value.y = initialPosition.y;
      // @ts-ignore
      draggable.value.style.transform = `translate(${position.value.x}px, ${position.value.y}px)`;
    }

    interact(draggable.value as any).draggable({
      modifiers: [
        interact.modifiers.snap({
          targets: [interact.snappers.grid({ x: 5, y: 5 })],
          range: Infinity,
          relativePoints: [{ x: 0, y: 0 }],
        }),
      ],
      listeners: {
        move(event) {
          position.value.x += event.dx;
          position.value.y += event.dy;

          event.target.style.transform = `translate(${position.value.x}px, ${position.value.y}px)`;
          event.target.style['z-index'] = ''

          // Send position move event
          draggableEvents.emit(DraggableEvents.ON_POSITION_MOVE, { offset: { x: event.dx, y: event.dy } as CardPosition });
        },
      },
    });
  });

  return { draggable, position, draggableEvents };
}

export function useDraggable() {
  return { setup };
}
