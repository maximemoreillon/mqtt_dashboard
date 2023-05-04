<template>
  <v-card max-width="60rem" class="mx-auto">
    <v-card-title>{{ username }}'s devices</v-card-title>

    <v-card-text>
      <template v-if="!$store.state.mqtt_connected">
        <v-row justify="center">
          <v-col class="text-center">
            <v-progress-circular indeterminate />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col class="text-center">
            <span>Connecting to MQTT</span>
          </v-col>
        </v-row>
      </template>

      <template v-else-if="$store.state.devices.length < 1">
        <v-row justify="center">
          <v-col class="text-center">
            <v-progress-circular indeterminate />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col class="text-center">
            <span>Waiting for devices</span>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <v-row
          v-for="(device, index) in $store.state.devices"
          :key="`device_${index}`"
          dense
        >
          <v-col cols="12">
            <Device :device="device" />
          </v-col>
        </v-row>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import Device from "@/components/Device.vue"

export default {
  name: "Home",
  components: {
    Device,
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  computed: {
    username() {
      const current_user = this.$store.state.current_user
      return current_user.display_name || current_user.username
    },
  },
}
</script>
