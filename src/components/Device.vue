<template>

  <v-card
    outlined
    class="my-4 ">

    <v-toolbar flat>
      <v-toolbar-title>{{device.nickname || device.name}}</v-toolbar-title>
      <v-spacer></v-spacer>


      <v-btn
        v-if="device.connected && device.state"
        icon
        :disabled="!device.connected"
        @click="toggle()"
        :color="device.state === 'on' ? '#c00000' : ''">
        <v-icon>mdi-power</v-icon>
      </v-btn>

      <v-btn
        v-if="!device.connected"
        icon
        disabled>
        <v-icon>mdi-wifi-off</v-icon>
      </v-btn>






      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item>
            <v-list-item-content>
              <v-btn
                text
                @click="clear_retained_messages()">
                <v-icon>mdi-delete</v-icon>
                <span>Remove</span>
              </v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-toolbar>

    <v-expansion-panels flat>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Device details
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle>Name</v-list-item-subtitle>
                <v-list-item-title>{{device.name}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle>Type</v-list-item-subtitle>
                <v-list-item-title>{{device.type || 'unknown'}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle>Address</v-list-item-subtitle>
                <v-list-item-title>
                  <a
                    v-if="this.device.address"
                    :href="`http://${this.device.address}`">
                    http://{{this.device.address}}
                  </a>
                  <span v-else>Unknown</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle>Status topic</v-list-item-subtitle>
                <v-list-item-title>{{device.status_topic}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle>Command topic</v-list-item-subtitle>
                <v-list-item-title>{{command_topic}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle>Connected</v-list-item-subtitle>
                <v-list-item-title>{{device.connected}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle>State</v-list-item-subtitle>
                <v-list-item-title>{{device.state}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-subtitle>Firmware version</v-list-item-subtitle>
                <v-list-item-title>
                  {{
                    device.firmware_version
                    || device.version
                    || 'unknown'
                  }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              two-line
              v-if="device.type === 'ircontroller'">
              <v-list-item-content>
                <v-list-item-subtitle>IR signal recording</v-list-item-subtitle>
                <v-row align="center">
                  <v-col cols="auto">
                    <v-btn
                      @click="record('on')">
                      Record ON
                    </v-btn>
                  </v-col>
                  <v-col cols="auto">
                    <v-btn
                      @click="record('off')">
                      Record OFF
                    </v-btn>
                  </v-col>
                  <v-spacer/>
                </v-row>




              </v-list-item-content>
            </v-list-item>
          </v-list>



        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>


  </v-card>


</template>

<script>
import mqtt_client from '@/mqtt_client.js'

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
      if(this.device.json) mqtt_client.publish(this.command_topic, JSON.stringify({state: 'on'}))
      else mqtt_client.publish(this.command_topic, 'on')
    },
    turn_off(){
      if(this.device.json) mqtt_client.publish(this.command_topic, JSON.stringify({state: 'off'}))
      else mqtt_client.publish(this.command_topic, 'off')
    },
    record(signal){
      mqtt_client.publish(this.command_topic, JSON.stringify({record: signal}))
    },
    toggle(){
      if(this.device.state === 'on') this.turn_off()
      else this.turn_on()
    },
    clear_retained_messages(){
      if(!confirm(`Remove device ${this.device.name}?`)) return
      const options = { retain: true }
      mqtt_client.publish(this.device.status_topic, new ArrayBuffer(), options)
      this.$store.commit('remove_device', this.device)
    }
  },
  computed: {
    username(){
      return this.$store.state.current_user.username
    },
    command_topic(){
      // not exactly elegant
      return this.device.status_topic.replace('/status','/command')
    },
  }

}
</script>
