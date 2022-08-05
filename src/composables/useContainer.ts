import Selecto from 'selecto';
import { onMounted, onUnmounted, Ref, ref } from 'vue';
import { useZone, useEvents, CardBusEventName } from '~/composables';
import { Card, CardPosition } from '~/models/card.model';
import { EventEmitter } from '~/models/event-emitter.model';
import { ZoneType } from '~/models/zone.model';

export enum ContainerBusEvents {
  SELECT_ELEMENT = 'select-element',
}

export enum ContainerEvents {
  LINE_SELECTED = 'line-SELECTED',
  GROUP_SELECTED = 'group-selected',
}

function setup(zoneName: ZoneType, initialElement?: Ref<null>) {
  const container = ref(null);
  const selected = ref([] as (HTMLElement | SVGElement)[]);
  const containerEvents = new EventEmitter();

  onUnmounted(() => {
    containerEvents.cleanUp();
  });

  onMounted(() => {
    const selecto = new Selecto({
      // @ts-ignore
      container: initialElement ? initialElement.value : container.value,
      dragContainer: '.terra-zone--container',
      selectableTargets: ['.draggable'],
      hitRate: 20,
      selectByClick: false,
      selectFromInside: false,
      toggleContinueSelect: ['shift'],
      ratio: 0,
    });

    const { removeItems, selectItems } = itemEvents(zoneName, selected);

    handleEvents(containerEvents, zoneName, selected);

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

  return { container, containerEvents };
}

export function useContainer() {
  return { setup };
}

function handleEvents(containerEvents: EventEmitter, zoneName: ZoneType, selected: Ref<(HTMLElement | SVGElement)[]>) {
  const { onEvent } = useEvents();

  onEvent(CardBusEventName.STACK_CARDS, () => {
    if (selected.value.length === 0) return;
    const startingEl = findBestSelectedElement(selected.value);
    containerEvents.emit(ContainerEvents.GROUP_SELECTED, { selected: selected.value, startingEle: startingEl });
  });

  onEvent(CardBusEventName.LINE_CARDS, () => {
    if (selected.value.length === 0) return;
    const startingEl = findBestSelectedElement(selected.value);
    containerEvents.emit(ContainerEvents.LINE_SELECTED, { selected: selected.value, startingEle: startingEl });
  });

  onEvent(ContainerBusEvents.SELECT_ELEMENT, ({ name, el }: { name: string; el: HTMLElement }) => {
    if (zoneName !== name) return;

    const { removeItems, selectItems } = itemEvents(zoneName, selected);

    removeItems();
    selectItems([el]);
  });
}

function itemEvents(zoneName: ZoneType, selected: Ref<(HTMLElement | SVGElement)[]>) {
  const { updateSelected } = useZone();

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

  return { selectItems, removeItems };
}

function findBestSelectedElement(selected: (HTMLElement | SVGElement)[]) {
  const { el: startingEle } = selected.reduce(
    (acc, value) => {
      const box = value.getBoundingClientRect();
      if (box.y < acc.pos.y && box.x < acc.pos.x) {
        return { el: value, pos: { x: box.x, y: box.y } };
      }

      return acc;
    },
    { pos: { x: 222220, y: 222220 } } as { pos: CardPosition; el: HTMLElement | SVGElement }
  );

  return startingEle;
}
