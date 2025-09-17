<template>
  <v-menu
    :value="true"
    :position-x="left"
    :position-y="top"
    :min-width="width"
    :max-width="width"
    absolute
    :close-on-click="false"
    :close-on-content-click="false"
    transition="slide-y-transition"
    content-class="mention-list-menu-wrapper"
  >
    <v-list ref="mentionList" max-height="400">
      <template v-if="items.length">
        <v-list-item-group :value="selectedIndex">
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            @click="selectItem(index)"
          >
            {{ item }}
          </v-list-item>
        </v-list-item-group>
      </template>
      <v-list-item v-else>No result</v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropType, defineComponent } from "vue";

import { type SuggestionProps } from "@tiptap/suggestion";

import { VList, VListItem, VListItemGroup, VMenu } from "vuetify/lib";

export default defineComponent({
  components: { VMenu, VList, VListItemGroup, VListItem },
  props: {
    clientRect: {
      type: Function as PropType<SuggestionProps["clientRect"]>,
      default: (): SuggestionProps["clientRect"] => undefined,
    },
    editor: {
      type: Object,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    command: {
      type: Function as PropType<SuggestionProps["command"]>,
      required: true,
    },
  },
  data() {
    return {
      selectedIndex: 0,
    };
  },
  computed: {
    clientRectInternal() {
      return this.clientRect ?? (() => new DOMRect());
    },
    left() {
      return this.editor.options.element.getBoundingClientRect().x + 25;
    },
    top() {
      const rect = this.clientRectInternal();
      return rect!.y + rect!.height + 8;
    },
    width() {
      return this.editor.options.element.offsetWidth - 50;
    },
  },
  watch: {
    items: function () {
      this.selectedIndex = 0;
    },
  },
  methods: {
    onKeyDown({ event }: { event: KeyboardEvent }): boolean {
      if (this.items.length > 0) {
        if (event.key === "ArrowUp") {
          this.upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          this.downHandler();
          return true;
        }

        if (event.key === "Enter") {
          this.enterHandler();
          return true;
        }
      }

      return false;
    },
    upHandler() {
      this.selectedIndex =
        (this.selectedIndex + this.items.length - 1) % this.items.length;

      const mentionList = this.$refs.mentionList as Vue;
      mentionList.$el
        ?.querySelector(`.v-list-item:nth-child(${this.selectedIndex + 1})`)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
    },
    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length;

      const mentionList = this.$refs.mentionList as Vue;
      mentionList.$el
        ?.querySelector(`.v-list-item:nth-child(${this.selectedIndex + 1})`)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
    },
    enterHandler() {
      this.selectItem(this.selectedIndex);
    },
    selectItem(index: number) {
      const item = this.items[index];

      if (item) {
        this.command({ id: item });
      }
    },
  },
});
</script>

<style lang="scss">
.mention-list-menu-wrapper {
  background-color: #fff;
}
</style>
