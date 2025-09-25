<template>
  <v-list ref="suggestionList" max-height="400">
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
</template>

<script lang="ts">
import Vue, { PropType, defineComponent } from "vue";

import { type SuggestionProps } from "@tiptap/suggestion";

import { VList, VListItem, VListItemGroup } from "vuetify/lib";

export default defineComponent({
  components: { VList, VListItemGroup, VListItem },
  props: {
    items: {
      type: Array,
      required: true,
    },
    command: {
      type: Function as PropType<SuggestionProps["command"]>,
      required: true,
    },
    query: {
      type: String as PropType<SuggestionProps["query"]>,
      default: "",
    },
  },
  data() {
    return {
      selectedIndex: 0,
    };
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

      const suggestionList = this.$refs.suggestionList as Vue;
      if (suggestionList) {
        suggestionList.$el
          ?.querySelector(`.v-list-item:nth-child(${this.selectedIndex + 1})`)
          ?.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
      }
    },
    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length;

      const suggestionList = this.$refs.suggestionList as Vue;
      if (suggestionList) {
        suggestionList.$el
          ?.querySelector(`.v-list-item:nth-child(${this.selectedIndex + 1})`)
          ?.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
      }
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
