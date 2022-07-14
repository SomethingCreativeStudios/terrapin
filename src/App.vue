<script lang="tsx">
import { defineComponent } from 'vue';
import { TerraCard } from './components';
import { useCard } from '~/composables/useCard';
import { findColors } from '~/models/card.model';

export default defineComponent({
  name: 'app',

  setup() {
    const { getDeck, loadDeck } = useCard();

    loadDeck('');

    console.log(findColors('{X}{X}{R}{13}{W}{B}'));

    return { deck: getDeck() };
  },

  render() {
    return (
      <div>
        <div class="class">
          {this.deck.map(card => (
            <img class="card" src={card.imagePath} />
          ))}
        </div>
      </div>
    );
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.cards {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.card {
  width: 150px;
}
</style>
