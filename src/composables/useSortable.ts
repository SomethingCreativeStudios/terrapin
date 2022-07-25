import Sortable from 'sortablejs';
import { onMounted, Ref, ref } from 'vue';

function setup(sortable?: Ref<null>) {
  const sortableRef = sortable || ref(null);

  onMounted(() => {
    const sortable = Sortable.create(sortableRef.value as any, {
      animation: 150,
    });
  });

  return { sortableRef };
}

export function useSortable() {
  return { setup };
}
