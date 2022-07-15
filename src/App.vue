<script lang="tsx">
import { defineComponent } from 'vue';
import { TerraCard } from './components';
import { useCard } from '~/composables/useCard';
import { computed } from '@vue/reactivity';

export default defineComponent({
  name: 'app',
  components: { TerraCard },
  setup() {
    const { getDeck, loadDeck } = useCard();

    loadDeck('');

    return { deck: getDeck() };
  },

  render() {
    return (
      <div>
        <div class="cards">
          {this.deck.map(card => (
            <terra-card class="card" card={card}></terra-card>
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
</style>
