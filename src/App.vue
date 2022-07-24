<script lang="tsx">
import { defineComponent, onMounted, ref } from 'vue';
import { TerraCard, TerraZone } from './components';
import { useCard } from '~/composables/useCard';
import { useContainer } from '~/composables/useContainer';
import { DisplayType } from './models/zone.model';

export default defineComponent({
  name: 'app',
  components: { TerraCard, TerraZone },
  setup() {
    const { setup } = useContainer();
    const { container } = setup();
    const { getDeck, loadDeck } = useCard();

    loadDeck('');

    return { deck: getDeck(), container };
  },

  render() {
    return (
      <div class="play-mat">
        <terra-zone class="zone-battlefield" name="battlefield" color={`#${Math.floor(Math.random() * 16777215).toString(16)}`}></terra-zone>
        <terra-zone class="zone-hand" name="hand" displayType={DisplayType.FLEX_ROW} color={`#${Math.floor(Math.random() * 16777215).toString(16)}`}></terra-zone>
        <terra-zone class="zone-deck" name="deck" color={`#${Math.floor(Math.random() * 16777215).toString(16)}`}></terra-zone>
      </div>
    );
  },
});
</script>

<style scoped lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.play-mat {
  display: grid;
  grid-template-areas:
    'battlefield battlefield battlefield'
    'hand        hand        deck';

  grid-template-columns: 1fr 1fr 200px;
  grid-template-rows: 500px 200px;
}

.zone-battlefield {
  grid-area: battlefield;
}

.zone-hand {
  grid-area: hand;
}

.zone-deck {
  grid-area: deck;
}

.container {
  width: 100%;
  height: 100%;

  padding: 10px;
}
.cards {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>
