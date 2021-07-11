<template>

  <v-card
    class="my-4 lighten-4"
    :class="{
      'red': device.state === 'on',
      'grey': device.state === 'disconnected'
      }"
    >

    <v-card-title>{{device.name}}</v-card-title>
    <v-card-text>State: {{device.state}}</v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        @click="turn_off()">
        Turn OFF
      </v-btn>
      <v-btn
        @click="turn_on()">
        Turn ON
      </v-btn>
  </v-card-actions>


  </v-card>


</template>

<script>

  export default {
    name: 'Home',
    props: {
      device: Object
    },
    components: {
    },
    data(){
      return {
      }
    },
    mounted(){
    },
    methods: {
      turn_on(){
        this.$mqtt.publish(this.command_topic, 'on')
      },
      turn_off(){
        this.$mqtt.publish(this.command_topic, 'off')
      }
    },
    computed: {
      username(){
        return this.$store.state.current_user.username
      },
      command_topic(){
        return `/${this.username}/${this.device.name}/command`
      },
      status_topic(){
        return `/${this.username}/${this.device.name}/status`
      },
    }

  }
</script>
