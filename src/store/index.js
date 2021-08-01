import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    current_user: null,
    devices: [],
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
      console.log(`Deleting all devices`)
      state.devices.splice(0, state.devices.length)
    }
  },

  actions: {
  },
  modules: {
  }
})
