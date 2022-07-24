import { computed } from '@vue/reactivity';
import interact from 'interactjs';
import { onMounted, reactive, ref } from 'vue';
import { Card } from '~/models/card.model';
import { DisplayType, Zone } from '~/models/zone.model';

const state = reactive({} as Record<string, Zone>);

// @ts-ignore
window.state.zone = state;

function addCardToZone(zone: string, card: Card) {
  state[zone].cards.push(card);
}

function moveCard(fromZone: string, toZone: string, card: Card) {
  state[fromZone].cards = state[fromZone].cards.filter((zoneCard) => zoneCard.cardId !== card.cardId);

  if (!state[toZone].cards.some((zoneCard) => zoneCard.cardId === card.cardId)) {
    state[toZone].cards.push(card);
  }
}

function addZone(name: string, displayType: DisplayType) {
  const zoneRef = ref(null);

  state[name] = { cards: [], displayType };

  onMounted(() => {
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

        var draggableElement = event.relatedTarget;
        var dropzoneElement = event.target;

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

        var draggableElement = event.relatedTarget;
        var dropzoneElement = event.target;

        console.log('Dropped', draggableElement.__vue__.card.name);
        moveCardDragDrop(name, draggableElement);
      },
      ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('droppable-target');
        event.target.classList.remove('droppable');
      },
    });
  });

  return { zoneRef, zone: computed(() => state[name]) };
}

export function useZone() {
  return { addZone, moveCard, addCardToZone };
}

function getCard(element: HTMLElement): Card {
  // @ts-ignore
  return element.__vue__.card;
}

function isSameZone(zone: string, element: HTMLElement) {
  const card = getCard(element);
  const cards = state[zone].cards ?? [];

  return cards.some((zoneCard) => card.cardId === zoneCard.cardId);
}

function moveCardDragDrop(newZone: string, element: HTMLElement) {
  const card = getCard(element);
  const currentZone = findZoneFromCard(card);

  moveCard(currentZone || '', newZone, card);
}

function findZoneFromCard({ cardId }: Card) {
  return Object.entries(state).find(([_, zone]) => zone.cards.some((card) => card.cardId === cardId))?.[0];
}
