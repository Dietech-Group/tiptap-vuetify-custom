import Vue from "vue";
import Vuetify from "vuetify";
import TiptapVuetifyPlugin from "@/TiptapVuetifyPlugin";

import "vuetify/dist/vuetify.min.css";

const vuetify = new Vuetify({
  lang: {
    current: "de",
  },
});

Vue.use(Vuetify);
Vue.use(TiptapVuetifyPlugin, {
  vuetify,
  iconsGroup: "mdi",
});

import App from "./App.vue";

import "./assets/main.css";

new Vue({
  render: (h) => h(App),
}).$mount("#app");
