import mqtt from 'mqtt'
import VueCookie from 'vue-cookie'

const mqtt_options = {
  username: VueCookie.get('jwt'),
  password: 'jwt',
}

const {
  VUE_APP_MQTT_BROKER_URL
} = process.env

const mqtt_client = mqtt.connect(VUE_APP_MQTT_BROKER_URL, mqtt_options)


export default mqtt_client
