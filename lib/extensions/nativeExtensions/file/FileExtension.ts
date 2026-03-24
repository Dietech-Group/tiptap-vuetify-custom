import { Action, FileNode, type ExtendedFileOptions } from "./FileNode";
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

import FileSelectDialog from "./FileSelectDialog.vue";
import FileLoadingOverlay from "./FileLoadingOverlay.vue";
import { createAndMountComponent } from "@/extensions/helper/ComponentFactory";

export default class FileExtension extends AbstractExtension {
  constructor(options: ExtendedFileOptions) {
    super(options, FileNode);
  }

  private isActionDiabled(action: Action): boolean {
    const options: ExtendedFileOptions = this.nativeExtensionInstance.options;

    if (!options.disableActions) return false;
    if (Array.isArray(options.disableActions))
      return options.disableActions.includes(action);

    return options.disableActions === action;
  }

  get availableActions(): ExtensionActionInterface[] {
    const nativeExtensionName = "customFile";
    const options: ExtendedFileOptions = this.nativeExtensionInstance.options;

    const actions: ExtensionActionInterface[] = [];
    if (!this.isActionDiabled("upload")) {
      actions.push({
        render: new ExtensionActionRenderTextBtn({
          text: new I18nText("extensions.File.buttons.upload"),
          nativeExtensionName,
          async onClick({ editor }) {
            const selector = new FileSelector(
              editor,
              options.fileTypes,
              options.maxFileSize,
              false,
              options.filterErrorFunc,
              (files: FileSource[] | File[]) => {
                createAndMountComponent(FileLoadingOverlay, editor, {
                  propsData: {
                    files,
                    upload: options.upload,
                    cancel: options.cancelRemainingUploads,
                    insert: (item: any) => {
                      const items = Array.isArray(item) ? item : [item];

                      editor.commands.insertContent(
                        items.map((item: any) => {
                          return {
                            type: "fileNode",
                            attrs: { id: item.id, label: item.label },
                          };
                        }),
                      );
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

    if (!this.isActionDiabled("addExisting")) {
      actions.push({
        render: new ExtensionActionRenderTextBtn({
          text: new I18nText("extensions.File.buttons.addExisting"),
          nativeExtensionName,
          async onClick({ editor }) {
            createAndMountComponent(
              options.select.component || FileSelectDialog,
              editor,
              {
                propsData: {
                  load: options.select.load,
                  insert: (item: any) => {
                    const items = Array.isArray(item) ? item : [item];

                    editor.commands.insertContent(
                      items.map((item: any) => {
                        return {
                          type: "fileNode",
                          attrs: { id: item.id, label: item.label },
                        };
                      }),
                    );
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
              tooltip: new I18nText("extensions.File.menu.tooltip"),
              icons: {
                [VuetifyIconsGroups.md]: new VuetifyIcon("attach_file"),
                [VuetifyIconsGroups.fa]: new VuetifyIcon("fas fa-paperclip"),
                [VuetifyIconsGroups.mdi]: new VuetifyIcon("mdi-paperclip"),
                [VuetifyIconsGroups.mdiSvg]: new VuetifyIcon(
                  "M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z",
                ),
              },
              actions,
            }),
          },
        ]
      : [];
  }
}
