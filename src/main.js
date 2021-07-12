import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueMqtt from 'vue-mqtt'
import VueCookies from 'vue-cookies'
import axios from 'axios'
import VueAxios from 'vue-axios'

const mqtt_options = { username: '', password: ''}
Vue.use(VueMqtt, process.env.VUE_APP_MQTT_BROKER_URL, mqtt_options);
Vue.use(VueAxios, axios)
Vue.use(VueCookies)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
