import { createApp } from 'vue';
import App from './App.vue';
import 'dragula/dist/dragula.css';
const app = createApp(App);

app.mixin({
  mounted() {
    this.$el.__vue__ = this; // Or __vue__ for backwards compatibility.
  },
});

app.mount('#app');
