<script lang="tsx">
import { defineComponent } from 'vue';
import { TerraCard, TerraZone, TerraHoverCard, TerraCardDialog, TerraActionBar, TerraPromptDialog, LifeTracker, ManaTracker } from './components';
import { useDeck, useCard, useHotKey, useDialog } from '~/composables';
import { ContainerType, ZoneType } from './models/zone.model';

const dialogComponents = {
  'terra-card-dialog': TerraCardDialog,
  'terra-prompt-dialog': TerraPromptDialog,
};

export default defineComponent({
  name: 'app',
  components: { TerraCard, TerraZone, TerraHoverCard, TerraCardDialog, TerraActionBar, LifeTracker, ManaTracker },
  setup() {
    const { getDeck, loadDeck } = useDeck();
    const { setUp } = useCard();
    const { setUpHotKeys } = useHotKey();
    const { getActiveDialogs } = useDialog();

    setUpHotKeys();
    setUp();
    loadDeck('');

    return { deck: getDeck(), dialogs: getActiveDialogs() };
  },

  render() {
    const dialogBlocks = this.dialogs.map((dialog) => {
      // @ts-ignore
      const Component = dialogComponents[dialog.dialog];
      return <Component dialog={dialog} />;
    });

    return (
      <div class="play-mat">
        <terra-zone class="zone-battlefield" name={ZoneType.battlefield} color={`#2c2c2c`}>
          <terra-hover-card></terra-hover-card>
          <mana-tracker class="mana-tracker"></mana-tracker>
        </terra-zone>
        <terra-zone class="zone-hand" name={ZoneType.hand} containerType={ContainerType.SORTABLE} color={`#2e2e2e`}></terra-zone>
        <terra-zone class="zone-deck" name={ZoneType.deck} containerType={ContainerType.TOP_CARD} color={`#3c3b3b`} disableHover={true}></terra-zone>
        <terra-zone class="zone-graveyard" name={ZoneType.graveyard} containerType={ContainerType.TOP_CARD} color={`#3c3b3b`} disableHover={true}></terra-zone>
        <terra-zone class="zone-exile" name={ZoneType.exile} containerType={ContainerType.TOP_CARD} color={`#3c3b3b`} disableHover={true}></terra-zone>
        <terra-action-bar class="zone-action"></terra-action-bar>
        {dialogBlocks}
        <life-tracker class="life-tracker"></life-tracker>
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
    'action battlefield battlefield battlefield battlefield battlefield'
    'hand   hand        hand        deck        graveyard   exile';

  grid-template-columns: 240px 1fr 1fr 150px 143px 150px;
  grid-template-rows: 1fr 230px;

  height: 100%;
  width: 100%;
}

.life-tracker {
  position: absolute;
  left: 270px;
  top: 18px;
}

.mana-tracker {
  position: absolute;
  left: 14px;
  bottom: 18px;
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

.zone-action {
  grid-area: action;
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
