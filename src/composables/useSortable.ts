import Sortable from 'sortablejs';
import { onMounted, Ref, ref } from 'vue';
import { ZoneType } from '~/models/zone.model';
import { useEvents } from './useEvents';
import { UserAction } from './useUserAction';

const { onEvent } = useEvents();

function setup(name: ZoneType, sortable?: Ref<null>) {
  const sortableRef = sortable || ref(null);

  onMounted(() => {
    if (!sortableRef.value) return;
    const sortable = Sortable.create(sortableRef.value as any, {
      animation: 150,
      ghostClass: 'terra-card--ghosted',
    });

    onEvent(UserAction.PICKING_TARGETS, ({ type }) => {
      sortable.option('disabled', type === 'START');
    });

    onEvent(UserAction.MULLIGAN, ({ type }) => {
      sortable.option('disabled', type === 'START');
    });
  });

  return { sortableRef };
}

export function useSortable() {
  return { setup };
}
