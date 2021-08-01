<template>
  <AppTemplate
    :options="options"
    @user="get_user($event)">

    <template v-slot:nav>
      <v-list
        dense
        nav >
        <v-list-item
          v-for="(item, index) in nav"
          :key="`nav_item_${index}`"
          :to="item.to"
          exact>
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

  </AppTemplate>
</template>

<script>
import AppTemplate from '@moreillon/vue_application_template_vuetify'
export default {
  name: 'App',

  components: {
    AppTemplate
  },

  data: () => ({
    options: {
      title: "IoT Dashboard",
      authenticate: true,
      skip_greetings: true,
      login_url: `${process.env.VUE_APP_USER_MANAGER_API_URL}/auth/login`,
      identification_url: `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/self`,
    },
    nav: [
      {title: 'My devices', to: {name: 'Home'}, icon: 'mdi-home'},
      {title: 'About', to: {name: 'About'}, icon: 'mdi-information-outline'},
    ],
    topic: null,
  }),
  mounted(){
    console.log(`App mounted`)

    this.$mqtt.on('message', this.manage_message)


    this.$mqtt.on('connect', () => {
      console.log(`MQTT connected, subscribing to ${this.topic}`)
      this.$mqtt.subscribe(this.topic)

    })
    this.$mqtt.on('close', (error) => {
      console.log(`MQTT disconnected: ${error}`)
    })




  },
  beforeDestroy() {
    console.log('App Destroyed')
    this.$mqtt.removeAllListeners('message')
    this.$mqtt.removeAllListeners('connect')
    this.$mqtt.removeAllListeners('close')
  },

  methods: {
    get_user(user){
      this.$store.commit('set_current_user', user)
      this.mqtt_connect()
    },
    mqtt_connect(){
      const jwt = localStorage.jwt
      this.$mqtt.options.username = jwt || 'unknown'
      this.$mqtt.options.password = 'jwt'

      console.log(`User changed, ending MQTT`)
      this.$mqtt.end(true)

      if(jwt) {
        console.log(`User ${this.username} logged in`)
        this.topic = `/${this.username}/#`
        this.$mqtt.reconnect()
      }

      if(!jwt) {
        console.log(`User logged out, unsub ${this.topic}`)
        this.$mqtt.unsubscribe(this.topic)
        this.topic = null
        this.$store.commit('remove_all_devices')
      }

    },
    manage_message(topic, message) {

      // only deal with devices that provide their status


      if(!topic.endsWith('/status')) return
      if(!topic.startsWith(`/${this.username}`)) return

      console.log(`Message arrived ${topic}`)

      let device = {
        status_topic: topic,
        name: topic.split('/')[2],
      }

      try {
        const message_json = JSON.parse(message.toString())
        device = {
          ...device,
          ...message_json,
          json: true,
        }
      }
      catch (e) {
        device = {
          ...device,
          state: message.toString(),
          json: false,
        }
      }

      const device_index = this.$store.state.devices.findIndex(existing_device => existing_device.name === device.name)
      if(device_index < 0) this.$store.commit('add_device', device)
      else this.$store.commit('update_device',{device_index, device})
    },
  },
  computed: {
    username(){
      return this.$store.state.current_user.username
    },

  }
}
</script>
