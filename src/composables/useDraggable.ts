import interact from 'interactjs';
import { onMounted, ref } from 'vue';
import { CardPosition } from '~/models/card.model';

function setup(initialPosition?: CardPosition) {
  const draggable = ref(null);
  const position = ref({ x: 0, y: 0 });

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
        },
      },
    });
  });

  return { draggable, position };
}

export function useDraggable() {
  return { setup };
}
