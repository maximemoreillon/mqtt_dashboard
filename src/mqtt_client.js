import mqtt from 'mqtt'

const mqtt_options = {
  username: localStorage.jwt,
  password: 'jwt',
}

const mqtt_client = mqtt.connect(process.env.VUE_APP_MQTT_BROKER_URL, mqtt_options)

export default mqtt_client
