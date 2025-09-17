import Router from "vue-router";

import Index from "src/pages/Index.vue";

export const routes = [
  {
    path: "/",
    name: "index",
    component: Index,
  },
];

export default new Router({
  base: "/tiptap-vuetify/",
  routes,
});
