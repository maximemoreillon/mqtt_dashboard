import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueMqtt from 'vue-mqtt'
import VueCookies from 'vue-cookies'


// const MQTT_BROKER_URL = process.env.VUE_APP_MQTT_BROKER_URL
const mqtt_options = {
  username: '',
  password: '',
}
Vue.use(VueMqtt, 'wss://mqtt.iot.maximemoreillon.com', mqtt_options);

Vue.use(VueCookies)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
