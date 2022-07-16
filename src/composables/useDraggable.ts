import interact from 'interactjs';
import { onMounted, ref } from 'vue';

function setup() {
  const draggable = ref(null);
  const position = ref({ x: 0, y: 0 });

  onMounted(() => {
    interact(draggable.value as any).draggable({
      modifiers: [
        interact.modifiers.snap({
          targets: [interact.snappers.grid({ x: 5, y: 5 })],
          range: Infinity,
          relativePoints: [{ x: 0, y: 0 }],
        }),
      ],
      listeners: {
        start(event) {
          console.log(position);
          console.log(event.type, event.target);
        },
        move(event) {
          position.value.x += event.dx;
          position.value.y += event.dy;

          event.target.style.transform = `translate(${position.value.x}px, ${position.value.y}px)`;
        },
      },
    });
  });

  return { draggable };
}

export function useDraggable() {
  return { setup };
}
