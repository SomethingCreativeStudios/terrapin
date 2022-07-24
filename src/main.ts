import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.mixin({
  mounted() {
    this.$el.__vue__ = this; // Or __vue__ for backwards compatibility.
  },
});

app.mount('#app');
