<script lang="tsx">
import { defineComponent, onMounted, ref } from 'vue';
import { TerraCard } from './components';
import { useCard } from '~/composables/useCard';
import { useContainer } from '~/composables/useContainer';

export default defineComponent({
  name: 'app',
  components: { TerraCard },
  setup() {
    const { setup } = useContainer();
    const { container } = setup();
    const { getDeck, loadDeck } = useCard();

    loadDeck('');

    return { deck: getDeck(), container };
  },

  render() {
    return (
      <div>
        <div ref="container" class="container">
          <div class="cards">
            {this.deck.map(card => (
              <terra-card class="card" card={card}></terra-card>
            ))}
          </div>
        </div>
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
