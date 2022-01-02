<template>
  <v-card>

    <v-card-title>{{username}}'s devices</v-card-title>



    <!-- $mqtt.connect not reactive enough it seems-->
    <v-container
      v-if="!$store.state.mqtt_connected"
      class="mt-12">
      <v-row justify="center">
        <v-col class="text-center">
          <v-progress-circular indeterminate/>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col class="text-center">
          <span>Connecting to MQTT</span>
        </v-col>
      </v-row>
    </v-container>

    <v-container
      v-else-if="$store.state.devices.length < 1"
      class="mt-12">
      <v-row justify="center">
        <v-col class="text-center">
          <v-progress-circular indeterminate/>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col class="text-center">
          <span>Waiting for devices</span>
        </v-col>
      </v-row>
    </v-container>

    <v-card-text
      v-else
      class="devices_wrapper mt-3">
      <Device
        v-for="(device, index) in $store.state.devices"
        :key="`device_${index}`"
        :device="device"/>
    </v-card-text>


  </v-card>

</template>

<script>
  import Device from '@/components/Device.vue'

  export default {
    name: 'Home',
    components: {
      Device
    },
    data(){
      return {}
    },
    mounted(){},
    methods: {},
    computed: {
      username(){
        const current_user = this.$store.state.current_user
        return current_user.display_name
          || current_user.username
      },
    }

  }
</script>
