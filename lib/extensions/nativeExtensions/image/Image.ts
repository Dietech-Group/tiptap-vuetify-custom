import { CustomImageNode, type ExtendedImageOptions } from "./CustomImageNode";
import ImageSelector from "./ImageSelector";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import { VuetifyIconsGroups } from "@/configs/theme";
import AbstractExtension from "@/extensions/AbstractExtension";
import ExtensionActionRenderBtn from "@/extensions/actions/renders/btn/ExtensionActionRenderBtn";
import VuetifyIcon from "@/extensions/nativeExtensions/icons/VuetifyIcon";
import I18nText from "@/i18n/I18nText";

export default class Image extends AbstractExtension {
  constructor(options: ExtendedImageOptions) {
    super(options, CustomImageNode);
  }

  get availableActions(): ExtensionActionInterface[] {
    const nativeExtensionName = "customImage";
    const options: ExtendedImageOptions = this.options;

    return [
      {
        render: new ExtensionActionRenderBtn({
          tooltip: new I18nText("extensions.Image.buttons.tooltip"),
          icons: {
            [VuetifyIconsGroups.md]: new VuetifyIcon("image"),
            [VuetifyIconsGroups.fa]: new VuetifyIcon("fas fa-image"),
            [VuetifyIconsGroups.mdi]: new VuetifyIcon("mdi-image"),
            [VuetifyIconsGroups.mdiSvg]: new VuetifyIcon(
              "M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z",
            ),
          },
          nativeExtensionName,
          async onClick({ editor }) {
            const selector = new ImageSelector(
              editor,
              options.fileTypes,
              options.maxFileSize,
              options.filterErrorFunc,
            );
            selector.open();
          },
        }),
      },
    ];
  }
}
