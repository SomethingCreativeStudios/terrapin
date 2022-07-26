import Sortable from 'sortablejs';
import { onMounted, Ref, ref } from 'vue';
import { useZone } from '~/composables/useZone';

const { reorderCards } = useZone();

function setup(name: string, sortable?: Ref<null>) {
  const sortableRef = sortable || ref(null);

  onMounted(() => {
    if (!sortableRef.value) return;
    Sortable.create(sortableRef.value as any, {
      animation: 150,
      ghostClass: 'terra-card--ghosted',
      onEnd: (evt) => {
        reorderCards(name, evt.oldIndex || 0, evt.newIndex || 0);
      },
    });
  });

  return { sortableRef };
}

export function useSortable() {
  return { setup };
}
