export const PACKAGE_NAME = "tiptap-vuetify-custom";

export const VuetifyVuePrototypeProperty = "$vuetify";

export const EVENTS = {
  INPUT: "input" as const,
  INIT: "init" as const,
  BLUR: "blur" as const,
  FOCUS: "focus" as const,
};

export const PROPS = {
  VALUE: "value",
  EXTENSIONS: "extensions",
  TOOLBAR_ATTRIBUTES: "toolbarAttributes",
  EDITOR_PROPERTIES: "editorProperties",
  NATIVE_EXTENSIONS: "nativeExtensions",
  PLACEHOLDER: "placeholder",
  CARD_PROPS: "cardProps",
  OUTPUT_FORMAT: "outputFormat",
  TYPE: "type",
  MIN_HEIGHT: "minHeight",
  MAX_HEIGHT: "maxHeight",
  DISABLED: "disabled",
} as const;

// Define a type for the keys of the PROPS object
export type PropsKeys = keyof typeof PROPS;

// Define a type for the values of the PROPS object
export type PropsValues = (typeof PROPS)[PropsKeys];

export enum EDITOR_TYPES_ENUM {
  card = "card",
  inline = "inline",
}
