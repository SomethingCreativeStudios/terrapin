import Selecto from 'selecto';
import { onMounted, Ref, ref } from 'vue';

function setup(initialElement?: Ref<null>) {
  const container = ref(null);
  const selected = ref([] as (HTMLElement | SVGElement)[]);

  const selectItems = (items: (HTMLElement | SVGElement)[]) => {
    selected.value = items;
    selected.value?.forEach((item) => item.classList.add('selected'));
  };

  const removeItems = () => {
    selected.value?.forEach((item) => item.classList.remove('selected'));
    selected.value = [];
  };

  onMounted(() => {
    const selecto = new Selecto({
      // @ts-ignore
      container: initialElement ? initialElement.value : container.value,
      dragContainer: '.terra-zone',
      selectableTargets: ['.draggable'],
      hitRate: 20,
      selectByClick: true,
      selectFromInside: true,
      toggleContinueSelect: ['shift'],
      ratio: 0,
    });

    selecto
      .on('dragStart', (e) => {
        const target = e.inputEvent.target;

        if (target.classList.contains('draggable') || selected.value.some((t) => t === target || t.contains(target))) {
          removeItems();
          selectItems([target]);
          e.stop();
        } else {
        }
      })
      .on('select', (e) => {
        removeItems();
        selectItems(e.selected);
      })
      .on('selectStart', () => {
        removeItems();
      });
  });

  return { container };
}

export function useContainer() {
  return { setup };
}
