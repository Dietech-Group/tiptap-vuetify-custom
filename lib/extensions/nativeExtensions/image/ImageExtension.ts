import {
  CustomImageNode,
  type ExtendedImageOptions,
  type ImageUploadResult,
  type ImageSelectItem,
} from "./CustomImageNode";
import {
  type FileSource,
  FileSelector,
} from "@/extensions/helper/FileSelector";

import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import { VuetifyIconsGroups } from "@/configs/theme";
import AbstractExtension from "@/extensions/AbstractExtension";
import ExtensionActionRenderMenu from "@/extensions/actions/renders/menu/ExtensionActionRenderMenu";
import { ExtensionActionRenderTextBtn } from "@/extensions/actions/renders/btn/ExtensionActionRenderBtn";
import VuetifyIcon from "@/extensions/nativeExtensions/icons/VuetifyIcon";
import I18nText from "@/i18n/I18nText";

import SelectDialog from "@/extensions/helper/SelectDialog.vue";
import UploadOverlay from "@/extensions/helper/UploadOverlay.vue";
import { createAndMountComponent } from "@/extensions/helper/ComponentFactory";
import {
  isUploadEnabled,
  isAddExistingEnabled,
} from "@/extensions/helper/UploadSelect";

export default class ImageExtension extends AbstractExtension {
  constructor(options: ExtendedImageOptions) {
    super(options, CustomImageNode);
  }

  get availableActions(): ExtensionActionInterface[] {
    const nativeExtensionName = "customImage";
    const options: ExtendedImageOptions = this.nativeExtensionInstance.options;

    const actions: ExtensionActionInterface[] = [];

    if (isUploadEnabled(options)) {
      actions.push({
        render: new ExtensionActionRenderTextBtn({
          text: new I18nText("extensions.Image.buttons.upload"),
          nativeExtensionName,
          async onClick({ editor }) {
            const selector = new FileSelector(
              editor,
              options.includedFileTypes,
              options.maxFileSize,
              false,
              options.filterErrorFunc,
              (files: FileSource[] | File[]) => {
                createAndMountComponent(UploadOverlay, editor, {
                  propsData: {
                    files,
                    upload: options.upload,
                    cancel: options.cancelRemainingUploads ?? (() => {}),
                    insert: (result: ImageUploadResult) => {
                      editor.commands.insertContent({
                        type: "customImage",
                        attrs: {
                          id: result.id,
                          title: result.label,
                          src: result.src,
                          alt: result.alt ?? null,
                        },
                      });
                    },
                  },
                  onClose: () => editor.commands.focus(),
                });
              },
            );
            selector.open();
          },
        }),
      });
    }

    if (isAddExistingEnabled(options)) {
      actions.push({
        render: new ExtensionActionRenderTextBtn({
          text: new I18nText("extensions.Image.buttons.addExisting"),
          nativeExtensionName,
          async onClick({ editor }) {
            createAndMountComponent(
              options.select!.component || SelectDialog,
              editor,
              {
                propsData: {
                  load: options.select!.load,
                  insert: (item: ImageSelectItem) => {
                    editor.commands.insertContent({
                      type: "customImage",
                      attrs: {
                        id: item.id,
                        title: item.label,
                        src: item.src,
                        alt: item.alt ?? null,
                      },
                    });
                  },
                  customClass: (editor.options as any)?.editorInstanceUId,
                },
                onClose: () => editor.commands.focus(),
              },
            );
          },
        }),
      });
    }

    return actions.length
      ? [
          {
            render: new ExtensionActionRenderMenu({
              tooltip: new I18nText("extensions.Image.menu.tooltip"),
              icons: {
                [VuetifyIconsGroups.md]: new VuetifyIcon("image"),
                [VuetifyIconsGroups.fa]: new VuetifyIcon("fas fa-image"),
                [VuetifyIconsGroups.mdi]: new VuetifyIcon("mdi-image"),
                [VuetifyIconsGroups.mdiSvg]: new VuetifyIcon(
                  "M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z",
                ),
              },
              actions,
            }),
          },
        ]
      : [];
  }
}
