import type ExtensionActionInterface from "../../ExtensionActionInterface";
import type { ExtensionActionRenderColorPickerOptionsInterface } from "./ExtensionActionRenderColorPickerOptionsInterface";

export default class ExtensionActionRenderColorPicker {
  options: ExtensionActionRenderColorPickerOptionsInterface;

  constructor(options: ExtensionActionRenderColorPickerOptionsInterface) {
    this.options = options;
  }
}

export function isColorPicker(action: ExtensionActionInterface): boolean {
  return action.render instanceof ExtensionActionRenderColorPicker;
}
