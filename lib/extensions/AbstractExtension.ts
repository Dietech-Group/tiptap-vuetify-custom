import type ExtensionActionInterface from "./actions/ExtensionActionInterface";
import type AbstractExtensionInterface from "@/extensions/AbstractExtensionInterface";

export default abstract class AbstractExtension
  implements AbstractExtensionInterface
{
  nativeExtensionInstance: any = null;

  /**
   * Buttons available for display (e.g. depending on settings)
   */
  abstract get availableActions(): ExtensionActionInterface[];

  protected constructor(
    protected options: any,
    protected extensionClass: any,
  ) {
    if (extensionClass) {
      this.nativeExtensionInstance = extensionClass.configure(options);
    }
  }
}
