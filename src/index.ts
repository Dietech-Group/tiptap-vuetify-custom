import HelloWorld from "./components/HelloWorld.vue";

// This is needed if the user want to install the library globally.
export default {
  install(Vue: Vue.VueConstructor) {
    Vue.component("HelloWorld", HelloWorld);
  },
};

// This is needed if the user want to import the components every time they want to use them.
export { HelloWorld };
