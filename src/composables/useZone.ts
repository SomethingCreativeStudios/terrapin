import { computed } from '@vue/reactivity';
import interact from 'interactjs';
import { onMounted, reactive, ref } from 'vue';
import { Card, CardPosition } from '~/models/card.model';
import { ContainerType, Zone, ZoneType } from '~/models/zone.model';
import { castSpell } from '~/states';
import { useGameItems } from './useGameItems';
import { zoneChangesSubject } from '~/subjects';

const { setCardById, getCardById } = useGameItems();

const state = reactive({ zones: {} as Record<string, Zone> });

// @ts-ignore
window.state.zone = state;

function addCardToZone(zone: ZoneType, id: string) {
  if (state.zones[zone].cardIds.find((cardId) => cardId === id)) return;

  state.zones[zone].cardIds.push(id);

  const { position } = getCardById(id).value ?? {};
  setCardById(id, { zone, position: updateCardPosition(zone, position ?? { x: 0, y: 0 }, position) });
}

function moveCard(fromZone: ZoneType, toZone: ZoneType, id: string, moveToBottom = false) {
  state.zones[fromZone].cardIds = state.zones[fromZone].cardIds.filter((cardId) => cardId !== id);

  setCardById(id, { zone: toZone });

  if (!state.zones[toZone].cardIds.some((cardId) => cardId === id)) {
    if (moveToBottom) {
      state.zones[toZone].cardIds = [...state.zones[toZone].cardIds, id];
    } else {
      state.zones[toZone].cardIds.push(id);
    }
  }

  zoneChangesSubject.next({ newZone: toZone, cardIds: [id] });
}

function reorderCards(zone: ZoneType, oldIndex: number, newIndex: number) {
  const cards = state.zones[zone].cardIds;
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

  state.zones[name] = { cardIds: [], selected: [], wasSelected: [], containerType, disableHover };

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

function updateSelected(name: ZoneType, selected: string[]) {
  state.zones[name].wasSelected = [...state.zones[name].selected];
  state.zones[name].selected = selected;
}

function findZoneNameFromCard(id: string) {
  return Object.entries(state.zones).find(([_, zone]) => zone.cardIds.some((cardId) => cardId === id))?.[0] as ZoneType;
}

function findZoneFromCard(id: string) {
  const zoneName = findZoneNameFromCard(id);
  return state.zones[zoneName || ''];
}

function findOtherSelectedByCard(id: string) {
  const zoneName = findZoneNameFromCard(id);
  if (zoneName) {
    return state.zones[zoneName].selected.filter((found) => found !== id);
  }
  return [];
}

function getCardsInZone(zone: ZoneType) {
  return computed(() => state?.zones?.[zone]?.cardIds ?? []);
}

function setCardsInZone(zone: ZoneType, cardIds: string[]) {
  state.zones[zone].cardIds = cardIds;
}

function removeCardInZone(zone: ZoneType, id: string) {
  state.zones[zone].cardIds = state.zones[zone].cardIds.filter((cardId) => cardId !== id);
}

function getZones() {
  return computed(() => state?.zones);
}

export function useZone() {
  return {
    addZone,
    getCardsInZone,
    setCardsInZone,
    moveCard,
    addCardToZone,
    reorderCards,
    dragDropCard,
    findZoneNameFromCard,
    findZoneFromCard,
    findOtherSelectedByCard,
    updateSelected,
    removeCardInZone,
    getZones,
  };
}

function getCard(element: HTMLElement): Card {
  // @ts-ignore
  return element?.__vue__?.card ?? element.__vueParentComponent.ctx.card;
}

function isSameZone(zone: ZoneType, element: HTMLElement) {
  const card = getCard(element);
  const cardIds = state.zones[zone].cardIds ?? [];

  return cardIds.some((cardId) => card.cardId === cardId);
}

function moveCardDragDrop(newZone: ZoneType, element: HTMLElement, newPosition?: CardPosition, moveSelected = false) {
  const card = getCard(element);
  const currentZone = findZoneNameFromCard(card.cardId);
  const { position } = getCardById(card.cardId).value ?? {};
  const updatedPosition = updateCardPosition(newZone, position ?? { x: 0, y: 0 }, newPosition);

  if (newZone === ZoneType.battlefield) {
    setCardById(card.cardId, { position: updatedPosition });
    castSpell(card, { cardPos: updatedPosition });
    return;
  }

  setCardById(card.cardId, { position: updatedPosition });
  moveCard(currentZone || '', newZone, card.cardId);

  if (moveSelected) {
    state.zones[currentZone || ''].selected.forEach((card) => {
      moveCard(currentZone || '', newZone, card);
    });
  }
  state.zones[currentZone].selected = [];
}

function getOffsetPosition(zone: HTMLElement, card: HTMLElement): CardPosition {
  const zoneBox = zone.getBoundingClientRect();
  const cardBox = card.getBoundingClientRect();

  return { x: cardBox.x - zoneBox.x, y: cardBox.y - zoneBox.y };
}

function updateCardPosition(newZone: string, currentPosition: CardPosition, newPosition?: CardPosition): CardPosition {
  const containerType = state.zones[newZone].containerType;

  switch (containerType) {
    case ContainerType.CARD_DIALOG:
      return { x: 0, y: 0 };

    case ContainerType.TOP_CARD:
      return { x: 0, y: 30 };

    case ContainerType.SORTABLE:
      return { x: 0, y: 50 };

    case ContainerType.FREE_POSITION:
      return newPosition || currentPosition;

    default:
      return newPosition || currentPosition;
  }
}
