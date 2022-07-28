import { stringify } from 'querystring';
import Selecto from 'selecto';
import { onMounted, Ref, ref } from 'vue';
import { useZone, useEvents } from '~/composables';

export enum ContainerEvents {
  SELECT_ELEMENT = 'select-element',
}

function setup(zoneName: string, initialElement?: Ref<null>) {
  const { updateSelected } = useZone();
  const { onEvent } = useEvents();

  const container = ref(null);
  const selected = ref([] as (HTMLElement | SVGElement)[]);

  const selectItems = (items: (HTMLElement | SVGElement)[]) => {
    selected.value = items;
    selected.value?.forEach((item) => item.classList.add('selected'));
    updateSelected(
      zoneName,
      items.map((el) => {
        // @ts-ignore
        return el.__vue__.card;
      })
    );
  };

  const removeItems = () => {
    selected.value?.forEach((item) => item.classList.remove('selected'));
    selected.value = [];
    updateSelected(zoneName, []);
  };

  onMounted(() => {
    const selecto = new Selecto({
      // @ts-ignore
      container: initialElement ? initialElement.value : container.value,
      dragContainer: '.terra-zone',
      selectableTargets: ['.draggable'],
      hitRate: 20,
      selectByClick: false,
      selectFromInside: false,
      toggleContinueSelect: ['shift'],
      ratio: 0,
    });

    onEvent(ContainerEvents.SELECT_ELEMENT, ({ name, el }: { name: string; el: HTMLElement }) => {
      if (zoneName !== name) return;

      //if (selected.value.length > 0) return;

      removeItems();
      selectItems([el]);
    });

    selecto
      .on('dragStart', (e) => {
        const target = e.inputEvent.target;

        if (!target.classList.contains('draggable')) {
          removeItems();
        }
      })
      .on('select', (e) => {
        removeItems();
        selectItems(e.selected);
      });
  });

  return { container };
}

export function useContainer() {
  return { setup };
}
