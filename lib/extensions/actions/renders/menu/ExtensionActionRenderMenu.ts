import ExtensionActionInterface from "../../ExtensionActionInterface";
import type { ExtensionActionRenderMenuOptionsInterface } from "./ExtensionActionRenderMenuOptionsInterface";

export default class ExtensionActionRenderMenu {
  options: ExtensionActionRenderMenuOptionsInterface;

  constructor(options: ExtensionActionRenderMenuOptionsInterface) {
    this.options = options;
  }
}

export function isMenu(action: ExtensionActionInterface): boolean {
  return action.render instanceof ExtensionActionRenderMenu;
}
