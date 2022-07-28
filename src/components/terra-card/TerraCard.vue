<script lang="tsx">
import { defineComponent, computed, PropType, ref } from 'vue';
import { useDraggable, useZone, DraggableEvents, ContainerEvents, useEvents } from '~/composables';
import { Card, CardPosition } from '~/models/card.model';
import { DisplayType } from '~/models/zone.model';

export default defineComponent({
  name: 'terra-card',
  props: {
    card: {
      type: Object as PropType<Card>,
      default: () => ({}),
    },

    displayType: {
      type: String as PropType<DisplayType>,
      default: DisplayType.FREE_POSITION,
    },
  },
  setup(props) {
    const cardState = ref('initial');
    const { emitEvent, onEvent } = useEvents();
    const { setup: setUpDrag } = useDraggable();
    const { draggable, position, draggableEvents } = setUpDrag(props.card.position);

    const cardClass = computed(() => ({
      'terra-card': true,
      [`terra-card__${cardState.value}`]: true,
      'terra-card--relative': props.displayType === DisplayType.SORTABLE,
      draggable: true,
    }));

    if (props.displayType === DisplayType.SORTABLE) {
      return { cardClass };
    }

    draggableEvents.listen(DraggableEvents.ON_POSITION_MOVE, ({ offset }: { offset: CardPosition }) => {
      if (!draggable.value) return;
      if (!(draggable.value as HTMLElement).classList.contains('selected')) return;
      emitEvent(DraggableEvents.ON_POSITION_MOVE, { offset, senderId: props.card.cardId });
    });

    onEvent(DraggableEvents.ON_POSITION_MOVE, ({ offset, senderId }: { offset: CardPosition; senderId: string }) => {
      if (!draggable.value) return;
      if (props.card.cardId === senderId) return;
      if (!(draggable.value as HTMLElement).classList.contains('selected')) return;

      position.value.x += offset.x;
      position.value.y += offset.y;

      (draggable.value as HTMLElement).style.transform = `translate(${position.value.x}px, ${position.value.y}px)`;
    });

    return { draggable, cardState, cardClass };
  },
  methods: {
    onTap() {
      if (this.cardState === 'tapped') {
        this.cardState = 'untapped';
      } else {
        this.cardState = 'tapped';
      }
    },
    onClick(e: any) {
      const { emitEvent } = useEvents();
      const { findZoneFromCard } = useZone();
      emitEvent(ContainerEvents.SELECT_ELEMENT, { name: findZoneFromCard(this.card), el: e.target });
    },
  },
  render() {
    return (
      <div ref="draggable" class={this.cardClass} onClick={this.onClick} onDblclick={this.onTap}>
        <img class="terra-card__image" src={this.card.imagePath} />
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.terra-card {
  // width: 6vw;
  width: 122px;
  height: 170px;

  position: absolute;

  z-index: 100;
}

.terra-card__tapped {
  .terra-card__image {
    animation: tap 0.2s linear forwards;
  }
}

.terra-card__untapped {
  .terra-card__image {
    animation: untap 0.2s linear forwards;
  }
}

.terra-card.terra-card--relative {
  position: relative;
}

.droppable {
  z-index: 110;
}

.terra-card__image {
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.terra-card--ghosted {
  opacity: 0.6;
}

.selected .terra-card__image {
  outline: 3px solid yellow;
}

@keyframes tap {
  100% {
    transform: rotate(90deg);
  }
}

@keyframes untap {
  0% {
    transform: rotate(90deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
