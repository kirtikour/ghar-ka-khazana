import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './index.css';

const app = createApp(App);
const pinia = createPinia();

// Scroll reveal directive
app.directive('reveal', {
  mounted(el) {
    el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700', 'ease-out');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.classList.remove('opacity-0', 'translate-y-8');
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.05
    });
    observer.observe(el);
  }
});

app.use(pinia);
app.use(router);

app.mount('#app');
