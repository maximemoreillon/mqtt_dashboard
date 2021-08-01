<template>
  <AppTemplate
    :options="options"
    @user="get_user($event)">

    <template v-slot:nav>
      <v-list
        dense
        nav >
        <v-list-item
          v-for="(item, index) in nav"
          :key="`nav_item_${index}`"
          :to="item.to"
          exact>
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

  </AppTemplate>
</template>

<script>
import AppTemplate from '@moreillon/vue_application_template_vuetify'
export default {
  name: 'App',

  components: {
    AppTemplate
  },

  data: () => ({
    options: {
      title: "IoT Dashboard",
      authenticate: true,
      skip_greetings: true,
      login_url: `${process.env.VUE_APP_USER_MANAGER_API_URL}/auth/login`,
      identification_url: `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/self`,
    },
    nav: [
      {title: 'My devices', to: {name: 'Home'}, icon: 'mdi-home'},
      {title: 'About', to: {name: 'About'}, icon: 'mdi-information-outline'},
    ]
  }),

  methods: {
    get_user(user){
      this.$store.commit('set_current_user', user)
      this.mqtt_connect()
    },
    mqtt_connect(){
      //const jwt = this.$cookies.get('jwt')
      const jwt = localStorage.jwt
      this.$mqtt.options.username = jwt
      this.$mqtt.options.password = 'jwt'

      if(!jwt) this.$mqtt.end(true)
      else this.$mqtt.reconnect()

    },
  }
};
</script>
