<template>
  <v-card>
    <v-card-title>IoT Dashboard</v-card-title>
    <v-card-subtitle> v{{ version }} </v-card-subtitle>

    <v-card-text>
      <p>
        Developed and maintainted by
        <a href="https://maximemoreillon.com">Maxime MOREILLON</a>
      </p>
      <v-data-table
        disable-sort
        hide-default-footer
        :itemsPerPage="-1"
        :headers="headers"
        :items="services"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import { version } from "@/../package.json"
const {
  VUE_APP_LOGIN_URL,
  VUE_APP_IDENTIFICATION_URL,
  VUE_APP_MQTT_BROKER_URL,
} = process.env

export default {
  name: "About",
  data() {
    return {
      version,

      headers: [
        { text: "Setting", value: "name" },
        { text: "Value", value: "value" },
      ],
      services: [
        {
          name: "Login URL",
          value: VUE_APP_LOGIN_URL,
        },
        {
          name: "User identification URL",
          value: VUE_APP_IDENTIFICATION_URL,
        },
        {
          name: "MQTT Broker URL",
          value: VUE_APP_MQTT_BROKER_URL,
        },
      ],
    }
  },
}
</script>

<style scoped></style>
