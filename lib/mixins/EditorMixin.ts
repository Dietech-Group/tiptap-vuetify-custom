import { defineComponent, PropType } from "vue";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";
import type AbstractExtensionInterface from "@/extensions/AbstractExtensionInterface";
import { ExtensionActionRenderInEnum } from "@/extensions/actions/ExtensionActionRenderInEnum";

import { EVENTS, PROPS } from "@/const";

import { Editor, type Content } from "@tiptap/vue-2";
import type { Fragment } from "@tiptap/pm/model";

import { Document } from "@tiptap/extension-document";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { Placeholder } from "@tiptap/extensions";
import { type Extensions } from "@tiptap/core";

export default defineComponent({
  props: {
    [PROPS.DISABLED]: {
      type: Boolean,
      default: false,
    },
    [PROPS.VALUE]: {
      type: [String, Object],
      default: "",
    },
    [PROPS.EXTENSIONS]: {
      type: Array,
      default: (): any[] => [],
    },
    [PROPS.NATIVE_EXTENSIONS]: {
      type: Array,
      default: (): any[] => [],
    },
    [PROPS.PLACEHOLDER]: {
      type: String,
      default: undefined,
    },
    [PROPS.EDITOR_PROPERTIES]: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    [PROPS.MIN_HEIGHT]: {
      type: [String, Number],
      default: undefined,
    },
    [PROPS.MAX_HEIGHT]: {
      type: [String, Number],
      default: undefined,
    },
  },
  data(): {
    editor: any | null;
    availableExtensions: Extensions;
    availableActions: {
      toolbar: ExtensionActionInterface[];
      bubbleMenu: ExtensionActionInterface[];
    };
    emitAfterOnUpdate: boolean;
  } {
    return {
      editor: null,
      availableExtensions: [],
      availableActions: {
        toolbar: [],
        bubbleMenu: [],
      },
      emitAfterOnUpdate: false,
    };
  },
  computed: {
    contentDynamicStyles() {
      // if no unit of measurement is specified (e.g. 60, 25), it will be as px. That is 60em, 25% will remain so.
      const getUnitWithPxAsDefault = (str: string | number) => {
        if (!str) return str;

        let num: number;
        let unit: string | undefined;

        if (typeof str === "number") {
          num = str;
        } else {
          num = parseInt(str, 10);
          unit = str.slice(num.toString().length);
        }

        return num + (unit ?? "px");
      };

      return {
        minHeight: getUnitWithPxAsDefault(this[PROPS.MIN_HEIGHT]),
        maxHeight: getUnitWithPxAsDefault(this[PROPS.MAX_HEIGHT]),
      };
    },
  },
  watch: {
    disabled: function (val: boolean) {
      if (this.editor) this.editor.setOptions({ editable: !val });
    },
    value: function (val: Content | Fragment | Node) {
      if (this.emitAfterOnUpdate) {
        this.emitAfterOnUpdate = false;

        return;
      }

      if (this.editor)
        this.editor.commands.setContent(val, { emitUpdate: false });
    },
  },
  mounted() {
    this.initEditor();
  },
  methods: {
    initEditor() {
      const nativeExtensionsInstances: any = [];
      const extensionsInstances: AbstractExtensionInterface[] = [];
      // default extension options
      const paramsDefault = {
        renderIn: ExtensionActionRenderInEnum.toolbar,
        options: {},
      };

      (this[PROPS.EXTENSIONS] as any[]).forEach((extensionDefinition) => {
        let ExtensionClass;
        let params;

        // Getting the extension and its options
        if (Array.isArray(extensionDefinition)) {
          [ExtensionClass, params] = extensionDefinition;
          //TODO improve the check, but for some reason it doesn't work: http://bit.ly/2ALqFJB
        } else if (extensionDefinition.prototype.availableActions) {
          // Если extends от AbstractExtension
          ExtensionClass = extensionDefinition;
        } else {
          throw new Error(
            'Incorrect extension declaration passed to "extensions" prop (array). ' +
              "It looks like the array's element is in the wrong format.",
          );
        }

        // parameters with default values
        // Todo: deep merge
        const paramsFinal = { ...paramsDefault, ...params };
        const extension: AbstractExtensionInterface = new ExtensionClass(
          paramsFinal.options,
        );
        // const renderInVariants = Object.values(ExtensionActionRenderInEnum)
        //
        // if (!renderInVariants.includes(options.renderIn)) {
        //   throw new Error('Please, set the "renderIn" option to one of following values: ' + renderInVariants)
        // }

        // replenishing available actions for a specific renderIn
        this.availableActions[
          paramsFinal.renderIn as ExtensionActionRenderInEnum
        ].push(...extension.availableActions);

        // Collection of native extensions
        if (extension.nativeExtensionInstance) {
          nativeExtensionsInstances.push(extension.nativeExtensionInstance);
        }
        // Collection of extensions
        extensionsInstances.push(extension);
      });
      this.availableExtensions = [
        Document,
        Paragraph,
        Text,
        ...this[PROPS.NATIVE_EXTENSIONS],
        ...nativeExtensionsInstances,
      ];

      if (this[PROPS.PLACEHOLDER]) {
        this.availableExtensions.push(
          Placeholder.configure({
            emptyNodeClass: "tiptap-vuetify-editor__paragraph--is-empty",
            placeholder: this[PROPS.PLACEHOLDER],
            showOnlyWhenEditable: true,
          }),
        );
      }

      this.createEditor();

      this.$emit(EVENTS.INIT, {
        editor: this.editor,
      });

      extensionsInstances.forEach(
        (ext) => ext.onEditorInit && ext.onEditorInit(this.editor as Editor),
      );
    },
    createEditor() {
      this.editor = new Editor({
        editable: !this[PROPS.DISABLED],
        extensions: this.availableExtensions,
        ...this[PROPS.EDITOR_PROPERTIES],
        editorProps: this[PROPS.EDITOR_PROPERTIES].editorProps || {},
        content: this[PROPS.VALUE],
      });
    },
  },
});
