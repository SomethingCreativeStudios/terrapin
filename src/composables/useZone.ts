import interact from 'interactjs';
import { onMounted, reactive, ref } from 'vue';
import { Zone } from '~/models/zone.model';

const state = reactive({} as Record<string, Zone>);

// @ts-ignore
window.state.card = state;

function addZone(name: string) {
  const zone = ref(null);
  const position = ref({ x: 0, y: 0 });

  onMounted(() => {
    interact(zone.value as any).draggable({
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

  return { zone };
}

export function useZone() {
  return { addZone };
}
