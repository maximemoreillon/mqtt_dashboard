import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    current_user: null,
    devices: [],
    mqtt_connected: false,
  },
  mutations: {
    set_current_user(state, user){
      state.current_user = user
    },
    add_device(state, new_device){
      state.devices.push(new_device)
    },
    update_device(state, {device_index, device}){
      Vue.set(state.devices,device_index,device)
    },
    remove_device(state, device_index){
      state.devices.splice(device_index,1)
    },
    remove_all_devices(state){
      state.devices.splice(0, state.devices.length)
    },
    set_mqtt_connected(state, connected){
      state.mqtt_connected = connected
    }
  },

  actions: {
  },
  modules: {
  }
})
