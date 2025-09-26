import Vue from "vue";

import Router from "vue-router";

import Vuetify, {
  // Components used in demo
  VApp,
  VMain,
  VContainer,
  // Components used in this package
  VDialog,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VBtn,
  VSpacer,
  VIcon,
  VTextField,
  VTooltip,
  VToolbar,
  VMenu,
  VList,
  VListItemGroup,
  VListItem,
} from "vuetify/lib";
import "vuetify/dist/vuetify.min.css";

// icons
import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css";

import App from "./App.vue";
import { TiptapVuetifyPlugin } from "src/lib";
import router from "./router.js";

const vuetify = new Vuetify({
  lang: {
    current: "de", // en | es | fr | pl | ru | uk | ptbr | tr | he | nl | ja | de | ko | zhHans | fa | sv | cs | it | el
  },
});

Vue.use(Router);
Vue.use(Vuetify, {
  components: {
    // Components used in demo
    VApp,
    VMain,
    VContainer,
    // Components used in this package
    VDialog,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VBtn,
    VSpacer,
    VIcon,
    VTextField,
    VTooltip,
    VToolbar,
    VMenu,
    VList,
    VListItemGroup,
    VListItem,
  },
  directives: {},
});
Vue.use(TiptapVuetifyPlugin, {
  vuetify,
  iconsGroup: "mdi", // VuetifyIconsGroups (fa, md, mdi, mdiSvg)
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  vuetify,
  render: (h) => h(App),
});
