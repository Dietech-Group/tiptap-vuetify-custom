<template>
  <v-list ref="suggestionList" max-height="400">
    <template v-if="itemsInternal.length">
      <v-list-item-group :value="selectedIndex">
        <v-list-item
          v-for="(item, index) in itemsInternal"
          :key="index"
          :class="typeOf(item) === 'short' ? 'primary' : 'purple'"
          class="lighten-4"
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
      type: Array as PropType<string[]>,
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
      itemsInternal: [] as string[],
      selectedIndex: 0,
      loading: false,
      pagesLoaded: 0,
      allPagesLoaded: false,
    };
  },
  watch: {
    query() {
      // console.log("Query changed:", this.query);
      this.selectedIndex = 0;
      this.pagesLoaded = 0;
      this.itemsInternal.splice(0);
      this.loadItemsIfNeeded(false);
    },
    selectedIndex() {
      this.loadItemsIfNeeded(true);
    },
  },
  methods: {
    loadItemsIfNeeded(more: boolean) {
      if (
        this.selectedIndex >= this.itemsInternal.length - 1 &&
        !this.allPagesLoaded
      ) {
        this.$emit("load", {
          query: this.query,
          page: this.pagesLoaded + (more ? 1 : 0),
          callback: (item: any[], page: number, allPagesLoaded: boolean) => {
            // console.log(`Page ${page} loaded. More pages: ${!allPagesLoaded}`);
            this.pagesLoaded = page;
            this.allPagesLoaded = allPagesLoaded;
            this.itemsInternal.push(...item);
          },
        });
      }
    },
    typeOf(item: string) {
      return item.length <= 10 ? "short" : "long";
    },
    onKeyDown({ event }: { event: KeyboardEvent }): boolean {
      if (this.itemsInternal.length > 0) {
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
      this.selectedIndex = Math.max(0, this.selectedIndex - 1);

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
      this.selectedIndex = Math.min(
        this.selectedIndex + 1,
        Math.max(0, this.itemsInternal.length - 1),
      );

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
      const item = this.itemsInternal[index];

      if (item) {
        this.command({ id: item });
      }
    },
  },
});
</script>
