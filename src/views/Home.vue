<template>
  <div class="">
    <h1>{{username}}'s devices</h1>


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




    <div
      v-else
      class="devices_wrapper mt-3">
      <Device
        v-for="(device, index) in $store.state.devices"
        :key="`device_${index}`"
        :device="device"
        @removed="remove_device(index)"/>
    </div>



  </div>

</template>

<script>
  import Device from '@/components/Device.vue'

  export default {
    name: 'Home',

    components: {
      Device
    },
    data(){
      return {
      }
    },
    mounted(){

    },

    methods: {

    },
    computed: {
      username(){
        return this.$store.state.current_user.username
      },
    }

  }
</script>
