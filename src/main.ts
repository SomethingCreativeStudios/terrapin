import { createApp } from 'vue';
import App from './App.vue';
import 'dragula/dist/dragula.css';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';
import ContextMenu from '@imengyu/vue3-context-menu';

const app = createApp(App);

app.use(ContextMenu);

app.mixin({
  mounted() {
    this.$el.__vue__ = this; // Or __vue__ for backwards compatibility.
  },
});

app.mount('#app');
