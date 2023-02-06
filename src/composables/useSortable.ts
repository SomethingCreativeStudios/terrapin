import Sortable from 'sortablejs';
import { onMounted, Ref, ref } from 'vue';
import { ZoneType } from '~/models/zone.model';
import { useEvents } from './useEvents';
import { GameStateEvent } from './useGameState';

const { onEvent } = useEvents();

function setup(name: ZoneType, sortable?: Ref<null>) {
  const sortableRef = sortable || ref(null);

  onMounted(() => {
    if (!sortableRef.value) return;
    const sortable = Sortable.create(sortableRef.value as any, {
      animation: 150,
      ghostClass: 'terra-card--ghosted',
      onEnd: (evt) => {
        //  if (evt.newIndex === evt.oldIndex || !evt.oldIndex || !evt.newIndex) return;
        //  reorderCards(name, evt.oldIndex - 1, evt.newIndex - 1);
      },
    });

    onEvent(GameStateEvent.PICKING_TARGETS, () => {
      sortable.option('disabled', true);
    });

    onEvent(GameStateEvent.MULLIGAN, () => {
      sortable.option('disabled', true);
    });

    onEvent(GameStateEvent.NORMAL, () => {
      sortable.option('disabled', false);
    });
  });

  return { sortableRef };
}

export function useSortable() {
  return { setup };
}
