<template>
  <div class="">
    <h1>{{username}}'s devices</h1>

    <div class="devices_wrapper mt-3">
      <Device
        v-for="(device, index) in devices"
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
        devices: []
      }
    },
    mounted(){
      this.$mqtt.on('message', this.manage_message)
      this.mqtt_subscribe()
    },
    beforeDestroy() {
      this.mqtt_unsubscribe()
      this.$mqtt.removeAllListeners('message')
    },
    methods: {
      manage_message(topic, message) {

        if(!topic.endsWith('/status')) return

        let device = {
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



        const found_device_index = this.devices.findIndex(existing_device => existing_device.name === device.name)
        if(found_device_index < 0) this.devices.push(device)
        else this.$set(this.devices,found_device_index,device)

      },
      mqtt_subscribe(){
        // Todo: deal with view destruction
        this.$mqtt.subscribe(this.topic)
      },
      mqtt_unsubscribe(){
        this.$mqtt.unsubscribe(this.topic)
      },
      remove_device(device_index){
        this.devices.splice(device_index,1)
      }


    },
    computed: {
      username(){
        return this.$store.state.current_user.username
      },
      topic(){
        return `/${this.username}/#`
      }
    }

  }
</script>
