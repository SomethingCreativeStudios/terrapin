import Sortable from 'sortablejs';
import { onMounted, Ref, ref } from 'vue';
import { useZone } from '~/composables/useZone';
import { ZoneType } from '~/models/zone.model';

const { reorderCards } = useZone();

function setup(name: ZoneType, sortable?: Ref<null>) {
  const sortableRef = sortable || ref(null);

  onMounted(() => {
    if (!sortableRef.value) return;
    Sortable.create(sortableRef.value as any, {
      animation: 150,
      ghostClass: 'terra-card--ghosted',
      onEnd: (evt) => {
        if (evt.newIndex === evt.oldIndex || !evt.oldIndex || !evt.newIndex) return;

        reorderCards(name, evt.oldIndex - 1, evt.newIndex - 1);
      },
    });
  });

  return { sortableRef };
}

export function useSortable() {
  return { setup };
}
