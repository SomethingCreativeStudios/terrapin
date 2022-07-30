<script lang="tsx">
import { defineComponent, PropType, computed } from 'vue';
import { setUpCard } from './composables/useTerraCard';
import { Card } from '~/models/card.model';
import { ContainerType } from '~/models/zone.model';

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
  },
  setup(props) {
    const { cardClass, draggable, onTap, onCardClick } = setUpCard(props.card, props.containerType);
    const cardImage = computed(() => (props.flipCard ? './public/missing-image.jpeg' : props.card.imagePath));

    if (props.containerType === ContainerType.SORTABLE) {
      return { cardClass, cardImage, onTap, onCardClick };
    }

    return { draggable, cardClass, cardImage, onTap, onCardClick };
  },
  render() {
    return (
      <div ref="draggable" class={this.cardClass} onClick={this.onCardClick} onDblclick={this.onTap}>
        <img class="terra-card__image" src={this.cardImage} />
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
.terra-card {
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
  box-shadow: 4px 2px 16px 0px #111;
}

.terra-card--ghosted {
  opacity: 0.6;
}

.selected .terra-card__image {
  outline: 3px solid yellow;
}

.selected {
  z-index: 310;
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
