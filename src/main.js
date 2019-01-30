import Vue from 'vue'
import App from './App.vue'
import vueGridKeyfocus from "./lib/index.js";
Vue.use(vueGridKeyfocus);
new Vue({
  el: '#app',
  render: h => h(App)
})
