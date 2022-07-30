import { computed, Ref } from 'vue';
import { useZone, useSortable, useContainer, ContainerEvents, useEvents, CardBusEventName } from '~/composables';
import { CardPosition } from '~/models/card.model';
import { EventEmitter } from '~/models/event-emitter.model';
import { ContainerType } from '~/models/zone.model';

type GroupType = { startingEle: HTMLElement; selected: HTMLElement[] };

function setUpZone(name: string, containerType: ContainerType, disableHover: boolean) {
  const { addZone } = useZone();

  const { zone, zoneRef } = addZone(name, containerType, disableHover);

  handleContainerSetUp(name, containerType, zoneRef);

  return { zoneRef, zone, zoneClasses: setUpClass(containerType) };
}

export function useTerraZone() {
  return { setUpZone };
}

function setUpClass(containerType: ContainerType) {
  return computed(() => ({
    'terra-zone': true,
    'list-group': true,
    [`terra-zone--${containerType !== ContainerType.FREE_POSITION ? 'sortable' : 'container'}`]: true,
  }));
}

function handleContainerSetUp(name: string, containerType: ContainerType, zoneRef: Ref<null>) {
  if (containerType !== ContainerType.FREE_POSITION) {
    const { setup } = useSortable();
    setup(name, zoneRef);
  } else {
    const { setup: containerSetUp } = useContainer();
    const { containerEvents } = containerSetUp(name, zoneRef);
    setUpContainerEvents(containerEvents);
  }
}

function setUpContainerEvents(containerEvents: EventEmitter) {
  const { emitEvent } = useEvents();

  containerEvents.listen(ContainerEvents.GROUP_SELECTED, ({ startingEle, selected }: GroupType) => {
    const box = startingEle.getBoundingClientRect();

    const startingPosition = { x: box.x, y: box.y } as CardPosition;
    selected.forEach((el, index) => {
      //@ts-ignore
      const card = el.__vue__.card as Card;

      startingPosition.x += 30;
      startingPosition.y += 30;

      emitEvent(CardBusEventName.POSITION_UPDATE, { cardId: card.cardId, pos: { ...startingPosition }, zIndex: 210 + index });
    });
  });

  containerEvents.listen(ContainerEvents.LINE_SELECTED, ({ startingEle, selected }: GroupType) => {
    const box = startingEle.getBoundingClientRect();

    const startingPosition = { x: box.x, y: box.y } as CardPosition;

    selected.forEach((el, index) => {
      //@ts-ignore
      const card = el.__vue__.card as Card;

      startingPosition.x += el.getBoundingClientRect().width + 5;

      emitEvent(CardBusEventName.POSITION_UPDATE, { cardId: card.cardId, pos: { ...startingPosition }, zIndex: 210 + index });
    });
  });
}
