<template>
  <div>
    <h1>IoT Dashboard</h1>

    <v-card-text>
      <p>Authors: Daiki YAMADA, Maxime MOREILLON</p>
      <v-data-table
        hide-default-footer
        :itemsPerPage="-1"
        :headers="headers"
        :items="services"/>
    </v-card-text>


  </div>
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
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

}

tr:not(:last-child) {
  border-bottom: 1px solid #dddddd;
}

th {
  text-align: left;
}
td {
  padding: 0.25em;
}


</style>
