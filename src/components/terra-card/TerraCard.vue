<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { setUpCard } from './composables/useTerraCard';
import { Card } from '~/models/card.model';
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
    const { cardClass, draggable, onTap, onCardClick } = setUpCard(props.card, props.displayType);

    if (props.displayType === DisplayType.SORTABLE) {
      return { cardClass };
    }

    return { draggable, cardClass, onTap, onCardClick };
  },
  render() {
    return (
      <div ref="draggable" class={this.cardClass} onClick={this.onCardClick} onDblclick={this.onTap}>
        <img class="terra-card__image" src={this.card.imagePath} />
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
