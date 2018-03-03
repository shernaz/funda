import Vue from 'vue'
import App from './App.vue'

import VueResource from 'vue-resource'
Vue.use(VueResource);

import Carousel3D from 'vue-carousel-3d';
Vue.use(Carousel3D);

import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyC8ROzZjZ0AtJmfQDlUQTTx1lPlx0HJnU8',
  }
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')