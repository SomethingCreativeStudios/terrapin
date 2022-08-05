import { computed } from '@vue/reactivity';
import interact from 'interactjs';
import { onMounted, reactive, ref, watch } from 'vue';
import { Card, CardPosition } from '~/models/card.model';
import { ContainerType, Zone, ZoneType } from '~/models/zone.model';

const state = reactive({ zones: {} as Record<string, Zone> });

// @ts-ignore
window.state.zone = state;

function addCardToZone(zone: ZoneType, card: Card) {
  state.zones[zone].cards.push(card);
}

function moveCard(fromZone: ZoneType, toZone: ZoneType, card: Card) {
  state.zones[fromZone].cards = state.zones[fromZone].cards.filter((zoneCard) => zoneCard.cardId !== card.cardId);

  if (!state.zones[toZone].cards.some((zoneCard) => zoneCard.cardId === card.cardId)) {
    state.zones[toZone].cards.push(card);
  }
}

function reorderCards(zone: ZoneType, oldIndex: number, newIndex: number) {
  const cards = state.zones[zone].cards;
  const item = cards.splice(oldIndex, 1)[0];
  cards.splice(newIndex, 0, item);
}

function dragDropCard(zone: HTMLElement, card: HTMLElement, dropPos: CardPosition) {
  // @ts-ignore
  const zoneName = zone.__vue__.name;
  const zoneBox = zone.getBoundingClientRect();

  const clientX = dropPos.x - 61;
  const clientY = dropPos.y - 85;

  const cardPos = { x: clientX - zoneBox.x, y: clientY - zoneBox.y };

  moveCardDragDrop(zoneName, card, cardPos);
}

function addZone(name: ZoneType, containerType: ContainerType, disableHover: boolean) {
  const zoneRef = ref(null);

  state.zones[name] = { cards: [], selected: [], wasSelected: [], containerType, disableHover };

  onMounted(() => {
    if (!zoneRef.value) return;

    (zoneRef.value as HTMLElement).ondragover = (event) => {
      event.preventDefault();

      if (event.dataTransfer) {
        const image = new Image();
        image.src = '';
        event.dataTransfer.setDragImage(image, 0, 0);
        event.dataTransfer.dropEffect = 'move';
      }
    };

    (zoneRef.value as HTMLElement).ondragend = (event) => {
      const draggableElement = event.target as HTMLElement;

      const daZones = document.elementsFromPoint(event.clientX, event.clientY);
      const daZone = daZones.find((ele) => ele.classList.contains('terra-zone'));

      // @ts-ignore
      if (daZone && daZone.__vue__.name !== name) {
        // @ts-ignore
        const zoneName = daZone.__vue__.name;
        const zoneBox = daZone.getBoundingClientRect();

        const clientX = event.clientX - 61;
        const clientY = event.clientY - 85;

        const cardPos = { x: clientX - zoneBox.x, y: clientY - zoneBox.y };

        moveCardDragDrop(zoneName, draggableElement, cardPos);
      }
    };

    interact(zoneRef.value as any).dropzone({
      accept: '.draggable',
      overlap: 0.75,

      ondropactivate: function (event) {
        if (isSameZone(name, event.relatedTarget)) {
          return;
        }

        // add active dropzone feedback
        event.target.classList.add('drop-active');
      },
      ondragenter: function (event) {
        if (isSameZone(name, event.relatedTarget)) {
          return;
        }

        const draggableElement = event.relatedTarget;
        const dropzoneElement = event.target;

        // feedback the possibility of a drop
        dropzoneElement.classList.add('droppable-target');
        draggableElement.classList.add('droppable');
      },
      ondragleave: function (event) {
        // remove the drop feedback style
        event.target.classList.remove('droppable-target');
        event.relatedTarget.classList.remove('droppable');
      },
      ondrop: function (event) {
        if (isSameZone(name, event.relatedTarget)) {
          return;
        }

        const draggableElement = event.relatedTarget as HTMLElement;
        const cardPos = containerType === ContainerType.SORTABLE ? undefined : getOffsetPosition(zoneRef.value as any, draggableElement);

        moveCardDragDrop(name, draggableElement, cardPos, true);
      },
      ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('droppable-target');
        event.target.classList.remove('droppable');
      },
    });
  });

  return { zoneRef, zone: computed(() => state.zones[name]) };
}

function updateSelected(name: ZoneType, selected: Card[]) {
  state.zones[name].wasSelected = [...state.zones[name].selected];
  state.zones[name].selected = selected;
}

function findZoneNameFromCard({ cardId }: Card) {
  return Object.entries(state.zones).find(([_, zone]) => zone.cards.some((card) => card.cardId === cardId))?.[0] as ZoneType;
}

function findZoneFromCard(card: Card) {
  const zoneName = findZoneNameFromCard(card);
  return state.zones[zoneName || ''];
}

function findOtherSelectedByCard(card: Card) {
  const zoneName = findZoneNameFromCard(card);
  if (zoneName) {
    return state.zones[zoneName].selected.filter((found) => found.cardId !== card.cardId);
  }
  return [];
}

export function useZone() {
  return { addZone, moveCard, addCardToZone, reorderCards, dragDropCard, findZoneNameFromCard, findZoneFromCard, findOtherSelectedByCard, updateSelected };
}

function getCard(element: HTMLElement): Card {
  // @ts-ignore
  return element?.__vue__?.card ?? element.__vueParentComponent.ctx.card;
}

function isSameZone(zone: ZoneType, element: HTMLElement) {
  const card = getCard(element);
  const cards = state.zones[zone].cards ?? [];

  return cards.some((zoneCard) => card.cardId === zoneCard.cardId);
}

function moveCardDragDrop(newZone: ZoneType, element: HTMLElement, newPosition?: CardPosition, moveSelected = false) {
  const card = getCard(element);
  const currentZone = findZoneNameFromCard(card);

  card.position = newPosition ? newPosition : card.position;

  moveCard(currentZone || '', newZone, card);

  if (moveSelected) {
    state.zones[currentZone || ''].selected.forEach((card) => {
      moveCard(currentZone || '', newZone, card);
    });
  }
}

function getOffsetPosition(zone: HTMLElement, card: HTMLElement): CardPosition {
  const zoneBox = zone.getBoundingClientRect();
  const cardBox = card.getBoundingClientRect();

  return { x: cardBox.x - zoneBox.x, y: cardBox.y - zoneBox.y };
}
