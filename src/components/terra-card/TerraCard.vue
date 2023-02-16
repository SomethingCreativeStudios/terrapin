<script lang="tsx">
import { defineComponent, PropType, computed } from 'vue';
import { setUpCard } from './composables/useTerraCard';
import { Card } from '~/models/card.model';
import { ContainerType } from '~/models/zone.model';
import { useMenu, useGameState, UserAction } from '~/composables';

export default defineComponent({
  name: 'terra-card',
  props: {
    card: {
      type: Object as PropType<Card>,
      default: () => ({}),
    },

    containerType: {
      type: String as PropType<ContainerType>,
      default: ContainerType.FREE_POSITION,
    },

    flipCard: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const { getMeta, getTargetMeta, getUserAction, meetTargetCount } = useGameState();
    const { cardClass, draggable, onTap, onCardClick, onCardHover } = setUpCard(props.card, props.containerType, ctx);

    const isTargeting = computed(() => getUserAction().value === UserAction.PICKING_TARGETS);
    const cardImage = computed(() => (props.flipCard ? './missing-image.jpeg' : props.card.imagePath));
    const cardState = getMeta(props.card.cardId);

    const isATarget = computed(() => !isTargeting.value || ((getTargetMeta()?.value?.targetFilter?.apply(props.card) ?? true) && !meetTargetCount().value));

    if (props.containerType === ContainerType.SORTABLE || props.containerType === ContainerType.CARD_DIALOG) {
      return { cardClass, cardState, cardImage, isATarget, onTap, onCardClick, onCardHover };
    }

    return { draggable, cardClass, cardImage, cardState, isATarget, onTap, onCardClick, onCardHover };
  },
  methods: {
    onContextMenu(e: MouseEvent) {
      e.preventDefault();
      const { getMeta } = useGameState();
      const { getCardMenu } = useMenu();
      const cardState = getMeta(this.card.cardId);

      // @ts-ignore
      this.$contextmenu(getCardMenu(this.card, cardState.value, { x: e.x, y: e.y }) as any);
    },
  },
  render() {
    return (
      <div
        ref="draggable"
        class={{ ...this.cardClass, 'terra-card--targeted': this.cardState?.targeted, 'terra-card--disabled': this.disabled || !this.isATarget }}
        onClick={this.onCardClick}
        onContextmenu={this.onContextMenu}
        onDblclick={this.onTap}
        onMouseenter={this.onCardHover}
      >
        <img class="terra-card__image" src={this.cardImage} />
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
$card-width: 122px;
$card-height: 170px;

.terra-card {
  min-width: $card-width;
  height: $card-height;

  position: absolute;

  z-index: 100;
}

.terra-card--disabled:not(.selected) {
  pointer-events: none;
  opacity: 0.5;
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

.terra-card.terra-card--dialog,
.terra-card.terra-card--relative {
  position: relative;
}

.terra-card.terra-card--relative {
  top: 30px;
  margin-left: 3px;
  margin-right: 3px;
}

.terra-card.terra-card--hovered {
  position: absolute;
}

.terra-card.terra-card--hovered {
  transition: all 11s ease-in-out;
  .terra-card__image {
    transform: scale(2);
  }
}

.droppable {
  z-index: 110;
}

.terra-card__image {
  width: 100%;
  height: 100%;
  pointer-events: none;
  box-shadow: 4px 2px 16px 0px #111;
}

.terra-card--ghosted {
  opacity: 0.6;
}

.selected .terra-card__image {
  outline: 3px solid yellow;
}

.terra-card--targeted .terra-card__image {
  outline: 3px solid rgb(249, 131, 13);
}

body[user-action='picking_targets'] {
  .selected .terra-card__image,
  .terra-card--targeted .terra-card__image {
    outline: 3px solid rgb(249, 131, 13);
  }
}

.selected {
  z-index: 310;
}

.terra-card__image--overlay {
  display: none;
}

.terra-card.terra-card--dialog {
  .terra-card__image {
    transition: all 0.2s ease-in-out;
    width: $card-width;
    height: $card-height;
  }
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
