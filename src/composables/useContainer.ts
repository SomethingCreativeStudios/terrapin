import Selecto from 'selecto';
import { onMounted, Ref, ref } from 'vue';
import { useZone, useEvents, CardBusEventName } from '~/composables';
import { Card, CardPosition } from '~/models/card.model';

export enum ContainerEvents {
  SELECT_ELEMENT = 'select-element',
}

function setup(zoneName: string, initialElement?: Ref<null>) {
  const { updateSelected } = useZone();
  const { onEvent, emitEvent } = useEvents();

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
      dragContainer: '.terra-zone--container',
      selectableTargets: ['.draggable'],
      hitRate: 20,
      selectByClick: false,
      selectFromInside: false,
      toggleContinueSelect: ['shift'],
      ratio: 0,
    });

    onEvent(CardBusEventName.STACK_CARDS, () => {
      if (selected.value.length === 0) return;
      // REFACTOR!!!!!
      const { pos, el: startingEle } = selected.value.reduce(
        (acc, value) => {
          const box = value.getBoundingClientRect();
          if (box.y < acc.pos.y && box.x < acc.pos.x) {
            return { el: value, pos: { x: box.x, y: box.y } };
          }

          return acc;
        },
        { pos: { x: 222220, y: 222220 } } as { pos: CardPosition; el: HTMLElement | SVGElement }
      );

      selected.value.forEach((el, index) => {
        //@ts-ignore
        const card = el.__vue__.card as Card;

        pos.x += 30;
        pos.y += 30;

        emitEvent(CardBusEventName.POSITION_UPDATE, { cardId: card.cardId, pos: { ...pos }, zIndex: 210 + index });
      });
    });

    onEvent(CardBusEventName.LINE_CARDS, () => {
      if (selected.value.length === 0) return;

      // REFACTOR!!!!!
      const { pos, el: startingEle } = selected.value.reduce(
        (acc, value) => {
          const box = value.getBoundingClientRect();
          if (box.y < acc.pos.y && box.x < acc.pos.x) {
            return { el: value, pos: { x: box.x, y: box.y } };
          }

          return acc;
        },
        { pos: { x: 222220, y: 222220 } } as { pos: CardPosition; el: HTMLElement | SVGElement }
      );

      selected.value.forEach((el, index) => {
        //@ts-ignore
        const card = el.__vue__.card as Card;

        pos.x += 125;

        emitEvent(CardBusEventName.POSITION_UPDATE, { cardId: card.cardId, pos: { ...pos }, zIndex: 210 + index });
      });
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
