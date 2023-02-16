import { createApp } from 'vue';
import App from './App.vue';
import 'dragula/dist/dragula.css';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';
import ContextMenu from '@imengyu/vue3-context-menu';
import { StackCollection } from '../src/cards/models/stack/stack-collection';

const app = createApp(App);

app.use(ContextMenu);

app.mixin({
  mounted() {
    this.$el.__vue__ = this; // Or __vue__ for backwards compatibility.

    const test = new StackCollection();
  },
});

app.mount('#app');
