<template>
  <v-dialog
    :value="visible"
    max-width="960px"
    :content-class="dialogContentClasses"
    @input="onDialogVisibilityChanged"
  >
    <v-card :loading="loading">
      <v-card-text class="pt-4">
        <v-text-field label="Suche" @input="onQueryInput"></v-text-field>
        <v-list style="overflow-y: auto; height: 100%">
          <v-list-item
            v-for="(item, index) in itemsInternal"
            :key="item.id"
            v-intersect="onIntersect"
            :data-index="index"
            @click="onItemClicked(item)"
          >
            {{ item.label }}
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { VDialog, VCard, VCardText, VList, VListItem } from "vuetify/lib";
import { Intersect } from "vuetify/lib/directives";

import I18nMixin from "@/mixins/I18nMixin";

export default defineComponent({
  components: {
    VDialog,
    VCard,
    VCardText,
    VList,
    VListItem,
  },
  directives: { Intersect },
  mixins: [I18nMixin],
  props: {
    load: {
      type: Function,
      required: true,
    },
    insert: {
      type: Function,
      required: true,
    },
    customClass: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      visible: false,
      itemsInternal: [] as any[],
      loading: false,
      pagesLoaded: 0,
      allPagesLoaded: false,
      query: "",
      cancelAndReload: false,
      loadOnNthLastItem: 5,
    };
  },
  computed: {
    dialogContentClasses() {
      const classes = ["select-dialog--fullheight"];

      if (this.customClass) classes.push(this.customClass);

      return classes.join(" ");
    },
  },
  mounted() {
    this.query = "";
    this.visible = true;
    this.loadItemsIfNeeded(false);
  },
  methods: {
    loadItemsIfNeeded(more: boolean) {
      if (this.loading) {
        this.cancelAndReload = true;
        return;
      }

      if (!more) {
        this.pagesLoaded = 0;
        this.itemsInternal.splice(0);
        this.allPagesLoaded = false;
      }

      this.loading = true;
      this.load({
        query: this.query,
        page: this.pagesLoaded + (more ? 1 : 0),
        callback: (item: any[], page: number, allPagesLoaded: boolean) => {
          this.loading = false;
          if (!this.cancelAndReload) {
            this.pagesLoaded = page;
            this.allPagesLoaded = allPagesLoaded;
            this.itemsInternal.push(...item);
          } else {
            this.cancelAndReload = false;
            this.loadItemsIfNeeded(false);
          }
        },
      });
    },
    onQueryInput(query: string) {
      this.query = query;
      this.loadItemsIfNeeded(false);
    },
    onIntersect(entries: any[]) {
      if (!this.loading && !this.allPagesLoaded) {
        if (
          entries.some(
            (entry: any) =>
              entry.isIntersecting &&
              Number(entry.target.dataset.index) >=
                this.itemsInternal?.length - 1 - this.loadOnNthLastItem,
          )
        ) {
          this.loadItemsIfNeeded(true);
        }
      }
    },
    onItemClicked(item: any) {
      this.insert(item);
      this.visible = false;
    },
    onDialogVisibilityChanged(visible: boolean) {
      if (!visible) this.$emit("close");
    },
  },
});
</script>
<style lang="scss">
.select-dialog--fullheight {
  height: 90%;
  overflow-y: unset;
  width: 100%;

  & > .v-card {
    display: flex;
    flex-direction: column;
    height: 100%;

    & > .v-card__text {
      flex-grow: 1;
      overflow-y: hidden;
      padding-bottom: 96px;
    }
  }
}
</style>
