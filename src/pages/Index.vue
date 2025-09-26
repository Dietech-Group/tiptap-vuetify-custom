<!-- eslint-disable vue/multi-word-component-names vue/no-v-html -->
<template>
  <div>
    <!-- :toolbar-attributes="{ color: 'yellow' }"
    min-height="500"
    max-height="600"
    :editor-properties="editorProperties"
    output-format="json"
   -->
    <tiptap-vuetify
      v-model="content"
      :extensions="extensions"
      placeholder="Write something …"
      @keydown="onkeydown"
    />

    <br />
    <br />
    <h1>Preview</h1>
    <hr />

    <div class="tiptap-vuetify-editor__content" v-html="content" />
  </div>
</template>

<script>
import dockerfile from "highlight.js/lib/languages/dockerfile";
import { common, createLowlight } from "lowlight";

// import FileSelector from '../Components/FileSelector'
import SuggestionListCustom from "../Components/SuggestionListCustom.vue";

import MyCustomExtension from "../extensions/MyCustomExtension";
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  CodeBlock,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History,
  Image,
  TaskList,
  TaskItem,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Mention,
} from "src/lib";

import "highlight.js/styles/stackoverflow-light.css";

const lowlight = createLowlight(common);
lowlight.register("dockerfile", dockerfile);

export default {
  components: {
    TiptapVuetify,
  },
  data: () => ({
    extensions: null,
    content: `
      <h1>Yay Headlines!</h1>
      <img src="https://picsum.photos/seed/test1/100" alt="test image" title="Test Image from picsum">
      <img src="https://picsum.photos/seed/test2/100" alt="test image with highres version" title="Test Image from picsum with highres version on click" data-high-res-src="https://picsum.photos/seed/test2/1000">
      <p><span data-type="mention" data-id="Christina Applegate"></span></p>
      <blockquote>Test quote.</blockquote>
      <p>All these <strong>cool tags</strong> are working now.</p>
      <p>
        There is always something to do. Thankfully, there are checklists for that. Don't forget to call mom.
      </p>
      <ul data-type="taskList">
        <li data-checked="false" data-type="taskItem">
          LoremipsumdolorsitametconsetetursadipscingelitrseddiamnonumyeirmodtemporinviduntutlaboreetdoloremagnaaliquyameratseddiamvoluptuaAtveroeosetaccusametjustoduodoloresetearebumStetclitakasdgubergrennoseatakimatasanctusestLoremipsumdolorsitamet
        </li>
        <li data-type="taskItem" data-checked="true">
          Buy beer
        </li>
        <li data-type="taskItem" data-checked="true">
          Buy meat
        </li>
        <li data-type="taskItem" data-checked="true">
          Buy milk
        </li>
        <li data-type="taskItem" data-checked="false">
          Call mom
        </li>
      </ul>
      <table>
        <tr>
          <th colspan="3" data-colwidth="100,0,0">Wide header</th>
        </tr>
        <tr>
          <td>One</td>
          <td>Two</td>
          <td>Three</td>
        </tr>
        <tr>
          <td>Four</td>
          <td>Five</td>
          <td>Six</td>
        </tr>
      </table>
    `,
    mentionItemsAll: [
      "Lea Thompson",
      "Cyndi Lauper",
      "Tom Cruise",
      "Madonna",
      "Jerry Hall",
      "Joan Collins",
      "Winona Ryder",
      "Christina Applegate",
      "Alyssa Milano",
      "Molly Ringwald",
      "Ally Sheedy",
      "Debbie Harry",
      "Olivia Newton-John",
      "Elton John",
      "Michael J. Fox",
      "Axl Rose",
      "Emilio Estevez",
      "Ralph Macchio",
      "Rob Lowe",
      "Jennifer Grey",
      "Mickey Rourke",
      "John Cusack",
      "Matthew Broderick",
      "Justine Bateman",
      "Lisa Bonet",
    ],
    pageSize: 5,
  }),
  created() {
    this.extensions = [
      MyCustomExtension,
      [
        Table,
        {
          options: {
            resizable: true,
          },
        },
      ],
      TableCell,
      TableHeader,
      TableRow,
      TaskList,
      [
        TaskItem,
        {
          options: {
            nested: true,
          },
        },
      ],
      Code,
      [
        CodeBlock,
        {
          options: {
            lowlight,
          },
        },
      ],
      HorizontalRule,
      Paragraph,
      History,
      HardBreak, // позволяет переносить через Shift + Ctrl + Enter
      Underline,
      Strike,
      Italic,
      ListItem, // если нужно использовать список (BulletList, OrderedList)
      BulletList,
      OrderedList,
      [
        Image,
        {
          options: {
            inline: true,
            maxFileSize: 1048576,
            filterErrorFunc: (type, file) => {
              console.log(type, file);
            },
          },
        },
      ],
      [
        Heading,
        {
          // Опции которые попадают в расширение tiptap
          options: {
            levels: [1, 2, 3],
          },
        },
      ],
      // но опции не обязательно указывать если нужно чтобы renderIn: 'toolbar', это по умолчанию.
      [
        Bold,
        {
          renderIn: "toolbar",
        },
      ],
      [
        Blockquote,
        {
          renderIn: "bubbleMenu",
          options: {
            levels: [1, 2, 3],
          },
        },
      ],
      [
        Link,
        {
          renderIn: "bubbleMenu",
        },
      ],
      [
        Mention,
        {
          options: {
            HTMLAttributes: {
              class: "mention",
            },
            deleteTriggerWithBackspace: true,
            suggestions: [
              {
                char: "@",
                items: ({ query }) => {
                  query = query || "";
                  return this.mentionItemsAll
                    .filter((item) =>
                      item.toLowerCase().startsWith(query.toLowerCase()),
                    )
                    .slice(0, 10);
                },
                allowSpaces: true,
              },
              {
                char: "#",
                menuContent: {
                  component: SuggestionListCustom,
                  listeners: {
                    load: ({ query, page, callback }) => {
                      const filteredItems = this.mentionItemsAll.filter(
                        (item) =>
                          item.toLowerCase().startsWith(query.toLowerCase()),
                      );

                      if (
                        page < Math.ceil(filteredItems.length / this.pageSize)
                      ) {
                        const loadedItems = filteredItems.slice(
                          page * this.pageSize,
                          Math.min(
                            (page + 1) * this.pageSize,
                            filteredItems.length,
                          ),
                        );

                        callback(
                          loadedItems,
                          page,
                          this.pagesLoaded >=
                            Math.ceil(filteredItems.length / this.pageSize),
                        );
                      }
                    },
                  },
                },
                allowSpaces: true,
              },
            ],
          },
        },
      ],
    ];
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onkeydown(event) {
      // console.log('event', event.key)
    },
  },
};
</script>
