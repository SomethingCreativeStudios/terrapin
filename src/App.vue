<script setup lang="ts">
import { TerraCard } from './components';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import { ref } from '@vue/reactivity';

const cards = ref([]);

async function onTest() {
  cards.value = await invoke('load_deck');
  console.log(cards.value);
}

listen<any>('update-cards__action', event => {
  console.log('Test');
});
</script>

<template>
  <button @click="onTest">TEST?</button>

  <div class="cards">
    <template v-for="card in cards" :key="card.name">
      <img class="card" :src="`https://card.${card.set_code}/${card.meta.scryfall_id}.png`" />
    </template>
  </div>

  <terra-card></terra-card>
</template>

<style>
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
