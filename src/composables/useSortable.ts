import Sortable from 'sortablejs';
import { onMounted, reactive, Ref, ref } from 'vue';
import { useZone } from '~/composables/useZone';
import dragula from 'dragula';
import { CardPosition } from '~/models/card.model';

const { reorderCards } = useZone();

const state = reactive({ position: {} as CardPosition });

const drag = dragula({});

window.onmousemove = (evt) => {
  state.position.x = evt.clientX;
  state.position.y = evt.clientY;
};

function setup(name: string, sortable?: Ref<null>) {
  const sortableRef = sortable || ref(null);

  onMounted(() => {
    if (!sortableRef.value) return;
    /*const sortable = Sortable.create(sortableRef.value as any, {
      animation: 150,
      ghostClass: 'terra-card--ghosted',
      onEnd: (evt) => {
        reorderCards(name, evt.oldIndex || 0, evt.newIndex || 0);
      },
    });*/
    drag.containers.push(sortableRef.value);

    drag.on('dragend', (el) => {
      const daZones = document.elementsFromPoint(state.position.x, state.position.y);
      const daZone = daZones.find((ele) => ele.classList.contains('terra-zone'));

      console.log(daZone);
    });
  });

  return { sortableRef };
}

export function useSortable() {
  return { setup };
}
