import { nodeViewProps as OriginalNodeViewProps } from "@tiptap/vue-2";

// Augment the '@tiptap/vue-2' module
declare module "@tiptap/vue-2" {
  // Declare the existing nodeViewProps type
  export const nodeViewProps: typeof OriginalNodeViewProps;
}
