<template>
  <AppTemplate :options="options" @user="user_changed($event)">
    <template v-slot:nav>
      <v-list dense nav>
        <v-list-item
          v-for="(item, index) in nav"
          :key="`nav_item_${index}`"
          :to="item.to"
          exact
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </AppTemplate>
</template>

<script>
import AppTemplate from "@moreillon/vue_application_template_vuetify"
import mqtt_client from "@/mqtt_client.js"

const { VUE_APP_LOGIN_URL, VUE_APP_IDENTIFICATION_URL } = process.env

export default {
  name: "App",

  components: {
    AppTemplate,
  },

  data: () => ({
    options: {
      title: "IoT Dashboard",
      login_url: VUE_APP_LOGIN_URL,
      identification_url: VUE_APP_IDENTIFICATION_URL,
    },
    nav: [
      { title: "My devices", to: { name: "Home" }, icon: "mdi-home" },
      {
        title: "About",
        to: { name: "About" },
        icon: "mdi-information-outline",
      },
    ],
    topic: null,
  }),
  mounted() {
    mqtt_client.on("connect", () => {
      this.$store.commit("set_mqtt_connected", true)
      if (this.topic) mqtt_client.subscribe(this.topic)
    })
    mqtt_client.on("error", (error) => {
      console.error(error)
      this.$store.commit("set_mqtt_connected", false)
    })
    mqtt_client.on("close", () => {
      console.warn(`MQTT connection closed`)
      this.$store.commit("set_mqtt_connected", false)
    })
    mqtt_client.on("message", this.handle_mqtt_messages)
  },
  beforeDestroy() {
    mqtt_client.removeAllListeners("close")
    mqtt_client.removeAllListeners("connect")
    mqtt_client.removeAllListeners("message")
    mqtt_client.removeAllListeners("error")
  },

  methods: {
    user_changed(user) {
      this.$store.commit("set_current_user", user)

      //const jwt = localStorage.jwt
      const jwt = this.$cookie.get("jwt")

      mqtt_client.options.username = jwt
      mqtt_client.options.password = "jwt"

      mqtt_client.end(true)

      if (jwt) {
        this.topic = `${this.username}/#`
        mqtt_client.reconnect()
      }

      if (!jwt) {
        mqtt_client.unsubscribe(this.topic)
        this.topic = null
        this.$store.commit("remove_all_devices")
      }
    },
    handle_mqtt_messages(topic, message) {
      if (!topic.endsWith("/status")) return
      if (!topic.startsWith(`${this.username}`)) return
      if (!message.toString()) return // When device removed, an empty payload gets emitted

      let device = {
        status_topic: topic,
        name: topic.split("/")[2], // Inelegant
      }

      try {
        const message_json = JSON.parse(message.toString())
        device = {
          ...device,
          ...message_json,
          json: true,
        }
      } catch (e) {
        device = {
          ...device,
          state: message.toString(),
          json: false,
        }
      }

      const device_index = this.$store.state.devices.findIndex(
        (existing_device) => existing_device.name === device.name
      )
      if (device_index < 0) this.$store.commit("add_device", device)
      else this.$store.commit("update_device", { device_index, device })
    },
  },
  computed: {
    username() {
      return this.$store.state.current_user.username
    },
  },
}
</script>
