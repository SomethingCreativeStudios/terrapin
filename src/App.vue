<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { TerraCard, TerraZone, TerraHoverCard, TerraCardDialog } from './components';
import { useDeck, useCard, useHotKey } from '~/composables';
import { ContainerType, ZoneType } from './models/zone.model';

export default defineComponent({
  name: 'app',
  components: { TerraCard, TerraZone, TerraHoverCard, TerraCardDialog },
  setup() {
    const { getDeck, loadDeck } = useDeck();
    const { setUpHoverEvents } = useCard();
    const { setUpHotKeys } = useHotKey();

    setUpHotKeys();
    setUpHoverEvents();
    loadDeck('');

    return { deck: getDeck() };
  },

  render() {
    return (
      <div class="play-mat">
        <terra-zone class="zone-battlefield" name={ZoneType.battlefield} color={`#2c2c2c`}>
          <terra-hover-card></terra-hover-card>
        </terra-zone>
        <terra-zone class="zone-hand" name={ZoneType.hand} containerType={ContainerType.SORTABLE} color={`#2e2e2e`}></terra-zone>
        <terra-zone class="zone-deck" name={ZoneType.deck} containerType={ContainerType.DIALOG} color={`#3c3b3b`} disableHover={true}></terra-zone>
        <terra-zone class="zone-graveyard" name={ZoneType.graveyard} containerType={ContainerType.DIALOG} color={`#3c3b3b`} disableHover={true}></terra-zone>
        <terra-zone class="zone-exile" name={ZoneType.exile} containerType={ContainerType.DIALOG} color={`#3c3b3b`} disableHover={true}></terra-zone>

        <terra-card-dialog width="60%" height="80%"></terra-card-dialog>
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
    'battlefield battlefield battlefield battlefield battlefield'
    'hand        hand        deck        graveyard   exile';

  grid-template-columns: 1fr 1fr 150px 143px 150px;
  grid-template-rows: 1fr 230px;

  height: 100%;
  width: 100%;
}

.zone-battlefield {
  grid-area: battlefield;
  position: relative;

  border: gray 12px solid;
}

.terra-hover-card {
  position: absolute;
  bottom: 0;
  right: 0;
}

.zone-hand {
  grid-area: hand;
}

.zone-deck {
  grid-area: deck;
  border: black 2px solid;
}

.zone-exile {
  grid-area: exile;
  border: black 2px solid;
}

.zone-graveyard {
  grid-area: graveyard;
  border: black 2px solid;
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
