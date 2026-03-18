import { Editor } from "@tiptap/core";
import Vue from "vue";
/**
 * Helper function to create Vue component and mount it to the nearest v-app component.
 */
export function createAndMountComponent(
  component: any,
  editor: Editor,
  {
    propsData: propsData = {},
    onClose,
  }: { propsData?: Record<string, unknown>; onClose?: () => void } = {},
) {
  let parentNode = (editor as any).contentComponent.$parent;
  while (parentNode !== undefined) {
    if (parentNode.$options.name === "v-app") break;
    parentNode = parentNode.$parent;
  }
  if (!parentNode) (editor as any).contentComponent.$root;

  const instance: any = new (Vue.extend(component))({
    vuetify: Vue.prototype.tiptapVuetifyPlugin.vuetify,
    parent: parentNode,
    propsData,
  });

  instance.$on("close", () => {
    instance.$destroy();
    if (instance.$el.parentNode) {
      instance.$el.parentNode.removeChild(instance.$el);
    }
    onClose?.();
  });

  instance.$mount();
  parentNode.$el.appendChild(instance.$el);

  return instance;
}
