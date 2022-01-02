<template>
  <v-card>
    <v-card-title>IoT Dashboard</v-card-title>

    <v-card-text>
      <p>Developed and maintainted by <a href="https://maximemoreillon.com">Maxime MOREILLON</a></p>
      <v-data-table
        disable-sort
        hide-default-footer
        :itemsPerPage="-1"
        :headers="headers"
        :items="services"/>
    </v-card-text>


  </v-card>
</template>

<script>
import pjson from '@/../package.json'
export default {
  name: 'About',
  data () {
    return {
      version: pjson.version,

      headers: [
        {text: 'Service', value: "name"},
        {text: 'Version', value: "version"},
        {text: 'URL', value: "url"},

      ],
      services: [
        {
          name: 'IoT Dashboard',
          url: window.location.origin,
          version: pjson.version
        },
        {
          name: 'User manager API',
          url: process.env.VUE_APP_USER_MANAGER_API_URL,
          version: null
        },
        {
          name: 'MQTT Broker URL',
          url: process.env.VUE_APP_MQTT_BROKER_URL,
          version: 'N/A'
        },
      ],
    }
  },
  mounted () {
    this.get_services_version()
  },
  methods: {

    get_services_version () {
      this.services.forEach((service) => {
        if (service.version) return
        service.version = 'Connecting...'
        this.axios.get(service.url)
          .then(({ data }) => { service.version = data.version })
          .catch(() => { service.version = 'Unable to connect' })
      })
    }
  }

}
</script>

<style scoped>



</style>
