import mqtt from 'mqtt'
import VueCookie from 'vue-cookie'

const mqtt_options = {
  username: VueCookie.get('jwt'),
  password: 'jwt',
}

const mqtt_client = mqtt.connect(process.env.VUE_APP_MQTT_BROKER_URL, mqtt_options)


export default mqtt_client
