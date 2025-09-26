<!-- eslint-disable vue/multi-word-component-names -->
<script>
export default {
  props: {
    mId: {
      type: String,
      required: true,
    },
    mType: {
      type: String,
      required: true,
    },
    noaccess: Boolean,
    deleted: Boolean,
    tooltip: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    route() {
      return "testroute";
    },
    href() {
      return "/";
    },
  },
  methods: {
    handleClick(event, navigate) {
      if (this.findRichtextArea()?.contentChanged) {
        event.preventDefault();
        window.open(this.href, "_blank");
        return;
      }
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.button === 1
      ) {
        event.preventDefault();
        window.open(this.href, "_blank");
        return;
      }
      navigate(event);
    },
    findRichtextArea() {
      let component = null;
      let parent = this.$parent;
      while (parent && !component) {
        if (
          parent.$options.name === "RichtextArea" ||
          parent.$options.name === "ActivityHubCommentEditor"
        ) {
          component = parent;
        }
        parent = parent.$parent;
      }
      return component;
    },
  },
};
</script>
<template>
  <router-link
    v-if="!noaccess && !deleted"
    v-slot="{ navigate }"
    custom
    :to="route"
    :href="href"
    :title="tooltip"
    class="blue lighten-5 primary--text object-link object-link--chip"
    ><a
      @click="handleClick($event, navigate)"
      @mousedown="$event.preventDefault()"
      ><slot /></a
  ></router-link>
  <span v-else class="grey lighten-3 object-link--chip" :title="tooltip">
    <s v-if="deleted"><slot /></s>
    <slot v-else />
  </span>
</template>
