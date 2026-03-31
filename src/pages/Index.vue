<!-- eslint-disable vue/multi-word-component-names vue/no-v-html -->
<template>
  <div>
    <v-alert
      ref="externalMentionMenuAttachElement"
      border="top"
      colored-border
      elevation="2"
    >
      <div class="d-flex">
        <v-checkbox v-model="mentionAttachActive" class="mr-2" />
        <div class="pt-3">
          Attach mention menu (for activation char '#') to this box, which makes
          the menu the same width as this box although the editor is smaller.<br />
          For the activation char '@' the menu is attached to the editor and
          therefor get it's with from it.
        </div>
      </div>
    </v-alert>
    <!-- :toolbar-attributes="{ color: 'yellow' }"
    min-height="500"
    max-height="600"
    :editor-properties="editorProperties"
    output-format="json"
   -->
    <tiptap-vuetify-editor
      v-model="content"
      :extensions="extensionsEditor"
      placeholder="Write something …"
      :max-height="mentionAttachActive ? '300px' : undefined"
      :style="mentionAttachActive ? 'width: 75%;' : undefined"
      @keydown="onkeydown"
    />

    <br />
    <br />
    <h1>Preview</h1>
    <hr />

    <tiptap-vuetify-content
      :value="content"
      :extensions="extensionsContent"
      disabled
    />
  </div>
</template>

<script>
import dockerfile from "highlight.js/lib/languages/dockerfile";
import { common, createLowlight } from "lowlight";

// import FileSelector from '../Components/FileSelector'
import CustomSuggestionList from "../Components/CustomSuggestionList.vue";
import CustomMentionExtension from "src/extensions/CustomMentionExtension";
import CustomFileSelectDialog from "../Components/CustomFileSelectDialog.vue";

import MyCustomExtension from "../extensions/MyCustomExtension";
import {
  TiptapVuetifyEditor,
  TiptapVuetifyContent,
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
  FileExtension,
} from "src/lib";

import "highlight.js/styles/stackoverflow-light.css";

const lowlight = createLowlight(common);
lowlight.register("dockerfile", dockerfile);

export default {
  components: {
    TiptapVuetifyEditor,
    TiptapVuetifyContent,
  },
  data: () => ({
    extensionsEditor: null,
    extensionsContent: null,
    mentionAttachActive: false,
    content: `
      <h1>Yay Headlines!</h1>
      <img src="https://picsum.photos/seed/test1/100" alt="test image" title="Test Image 2 from picsum with highres version on click" data-high-res-src="https://picsum.photos/seed/test1/1000">
      <img src="https://picsum.photos/seed/test2/100" alt="test image with highres version" title="Test Image 2 from picsum with highres version on click" data-high-res-src="https://picsum.photos/seed/test2/1000">
      <p><mention m-id="1" m-type="user">Christina Applegate</mention> is a mention</p>
      <p><file f-id="12">Market Analysis Report</file> is a file</p>
      <p>See this code snippet from <code>example.js</code> :</p>
      <pre><code>function factorial(n) {
    if (n &lt; 0) return undefined; // Factorial is not defined for negative numbers
    if (n === 0) return 1;        // Base case: 0! is 1
    return n * factorial(n - 1); // Recursive case
}

// Example usage:
console.log(factorial(5)); // Output: 120</code></pre>
      <p><a href="https://www.learnrubyonline.org/en/Hello_World">https://www.learnrubyonline.org/en/Hello_World</a></p>
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
    fileItemsAll: [
      { id: 1, label: "Project Milestones" },
      { id: 2, label: "Annual Report 2025" },
      { id: 3, label: "Budget Breakdown" },
      { id: 4, label: "Meeting Notes - Q1" },
      { id: 5, label: "Design Mockups" },
      { id: 6, label: "User Manual" },
      { id: 7, label: "Sprint Backlog" },
      { id: 8, label: "Research Findings" },
      { id: 9, label: "Code Documentation" },
      { id: 10, label: "Product Roadmap" },
      { id: 11, label: "Feature Requests" },
      { id: 12, label: "Market Analysis Report" },
      { id: 13, label: "Sales Presentation" },
      { id: 14, label: "Project Timeline" },
      { id: 15, label: "Web App Architecture" },
      { id: 16, label: "Client Feedback" },
      { id: 17, label: "Security Protocols" },
      { id: 18, label: "DevOps Guidelines" },
      { id: 19, label: "Changelog" },
      { id: 20, label: "Testing Reports" },
      { id: 21, label: "Team Roster" },
      { id: 22, label: "Event Agenda" },
      { id: 23, label: "Product Specifications" },
      { id: 24, label: "Webinar Recording" },
      { id: 25, label: "Onboarding Guide" },
      { id: 26, label: "Database Schema" },
      { id: 27, label: "Client Proposals" },
      { id: 28, label: "Error Logs Analysis" },
    ],
    pageSize: 5,
    cancelUploads: false,
  }),
  created() {
    this.extensionsEditor = this.extensionsDef();
    this.extensionsContent = this.extensionsDef();
  },
  methods: {
    extensionsDef() {
      return [
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
              enableTabIndentation: true,
              tabSize: 2,
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
              customAttributes: { "data-high-res-src": null },
              onClick: (attrs) => {
                if (attrs["data-high-res-src"])
                  window.open(attrs["data-high-res-src"], "_blank");
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
              nativeExtension: CustomMentionExtension,
              HTMLAttributes: {
                class: "mention",
              },
              deleteTriggerWithBackspace: true,
              suggestions: [
                {
                  char: "@",
                  button: {
                    title: "Nutzer:in erwähnen",
                    tooltip: "Nutzer:in erwähnen",
                  },
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
                  button: {
                    title: "Aufgaben erwähnen",
                  },
                  menu: {
                    getProps: () => {
                      return {
                        ...(this.mentionAttachActive
                          ? {
                              attach: () =>
                                this.$refs.externalMentionMenuAttachElement,
                            }
                          : {}),
                      };
                    },
                    content: {
                      component: CustomSuggestionList,
                      listeners: {
                        load: ({ query, page, callback }) => {
                          const filteredItems = this.mentionItemsAll
                            .map((item, index) => {
                              return {
                                id: index.toString(),
                                label: item,
                                type: "user",
                              };
                            })
                            .filter((item) =>
                              item.label
                                .toLowerCase()
                                .startsWith(query.toLowerCase()),
                            );

                          if (
                            page <
                            Math.ceil(filteredItems.length / this.pageSize)
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
                              page >=
                                Math.ceil(
                                  filteredItems.length / this.pageSize,
                                ) -
                                  1,
                            );
                          }
                        },
                      },
                    },
                  },
                  allowSpaces: true,
                },
              ],
            },
          },
        ],
        [
          FileExtension,
          {
            priority: 1,
            options: {
              maxFileSize: 5048576,
              filterErrorFunc: (type, file) => {
                console.log(type, file);
              },
              // disableActions: "addExisting",
              upload: (file, onSuccess, onError, onProgress) => {
                this.cancelUploads = false;

                // Simulate an upload process
                const totalSize = file.size;
                let loadedSize = 0;

                // onError(`${file.name}: Bad request`);
                // return;

                const uploadInterval = setInterval(() => {
                  if (this.cancelUploads) {
                    clearInterval(uploadInterval);
                    return;
                  }

                  // Simulate uploading in chunks (50 KB chunks)
                  const chunkSize = Math.min(50 * 1024, totalSize - loadedSize);
                  loadedSize += chunkSize;

                  // Calculate progress percentage
                  const progress = Math.min(loadedSize / totalSize, 1);
                  onProgress(progress);

                  if (loadedSize >= totalSize) {
                    clearInterval(uploadInterval);
                    onSuccess({
                      id: Math.floor(Math.random() * 1000),
                      title: file.name,
                    });
                  }
                }, 200); // Update progress every 200 ms
              },
              cancelRemainingUploads: () => {
                this.cancelUploads = true;
              },
              select: {
                component: CustomFileSelectDialog,
                load: ({ query, page, callback }) => {
                  const filteredItems = this.fileItemsAll.filter((item) =>
                    item.label.toLowerCase().startsWith(query.toLowerCase()),
                  );

                  if (page < Math.ceil(filteredItems.length / this.pageSize)) {
                    const loadedItems = filteredItems.slice(
                      page * this.pageSize,
                      Math.min(
                        (page + 1) * this.pageSize,
                        filteredItems.length,
                      ),
                    );

                    setTimeout(() => {
                      callback(
                        loadedItems,
                        page,
                        page >=
                          Math.ceil(filteredItems.length / this.pageSize) - 1,
                      );
                    }, 500);
                  }
                },
              },
              onClick: (id) => {
                alert(`File node clicked with id: ${id}`);
              },
            },
          },
        ],
      ];
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onkeydown(event) {
      // console.log('event', event.key)
    },
  },
};
</script>
