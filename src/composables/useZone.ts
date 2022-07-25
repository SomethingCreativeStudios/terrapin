import { computed } from '@vue/reactivity';
import interact from 'interactjs';
import { onMounted, reactive, ref } from 'vue';
import { Card, CardPosition } from '~/models/card.model';
import { DisplayType, Zone } from '~/models/zone.model';

const state = reactive({ zones: {} as Record<string, Zone> });

// @ts-ignore
window.state.zone = state;

function addCardToZone(zone: string, card: Card) {
  state.zones[zone].cards.push(card);
}

function moveCard(fromZone: string, toZone: string, card: Card) {
  state.zones[fromZone].cards = state.zones[fromZone].cards.filter((zoneCard) => zoneCard.cardId !== card.cardId);

  if (!state.zones[toZone].cards.some((zoneCard) => zoneCard.cardId === card.cardId)) {
    state.zones[toZone].cards.push(card);
  }
}

function addZone(name: string, displayType: DisplayType) {
  const zoneRef = ref(null);

  state.zones[name] = { cards: [], displayType };

  onMounted(() => {
    if (!zoneRef.value) return;

    (zoneRef.value as HTMLElement).ondragend = (event) => {
      const draggableElement = event.target as HTMLElement;

      const cardPos = displayType === DisplayType.SORTABLE ? undefined : getOffsetPosition(zoneRef.value as any, draggableElement);
      const daZone = document.elementFromPoint(event.clientX, event.clientY);

      if (daZone) {
        // @ts-ignore
        const zoneName = daZone.__vue__.name;
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

        console.log('Dropped', draggableElement.getBoundingClientRect());

        const cardPos = displayType === DisplayType.SORTABLE ? undefined : getOffsetPosition(zoneRef.value as any, draggableElement);

        moveCardDragDrop(name, draggableElement, cardPos);
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

export function useZone() {
  return { addZone, moveCard, addCardToZone };
}

function getCard(element: HTMLElement): Card {
  // @ts-ignore
  return element?.__vue__?.card ?? element.__vueParentComponent.ctx.card;
}

function isSameZone(zone: string, element: HTMLElement) {
  const card = getCard(element);
  const cards = state.zones[zone].cards ?? [];

  return cards.some((zoneCard) => card.cardId === zoneCard.cardId);
}

function moveCardDragDrop(newZone: string, element: HTMLElement, newPosition?: CardPosition) {
  const card = getCard(element);
  const currentZone = findZoneFromCard(card);

  card.position = newPosition ? newPosition : card.position;

  moveCard(currentZone || '', newZone, card);
}

function findZoneFromCard({ cardId }: Card) {
  return Object.entries(state.zones).find(([_, zone]) => zone.cards.some((card) => card.cardId === cardId))?.[0];
}

function getOffsetPosition(zone: HTMLElement, card: HTMLElement): CardPosition {
  const zoneBox = zone.getBoundingClientRect();
  const cardBox = card.getBoundingClientRect();

  return { x: cardBox.x - zoneBox.x, y: cardBox.y - zoneBox.y };
}
