import { Mention as MentionOriginal } from "@tiptap/extension-mention";

import { type Editor } from "@tiptap/vue-2";

import AbstractExtension from "@/extensions/AbstractExtension";
import ExtensionActionRenderBtn from "@/extensions/actions/renders/btn/ExtensionActionRenderBtn";
import type ExtensionActionInterface from "@/extensions/actions/ExtensionActionInterface";

import { VuetifyIconsGroups } from "@/configs/theme";
import VuetifyIcon from "@/extensions/nativeExtensions/icons/VuetifyIcon";
import I18nText from "@/i18n/I18nText";

import createDefaultSuggestionOptions from "./DefaultSuggestionOptions";

type MentionToolbarButtons = {
  char: string;
  icon: string | null;
  tooltip: string | null;
}[];

export default class Mention extends AbstractExtension {
  buttonDefinitions: MentionToolbarButtons = [];

  constructor(options: any) {
    options = options || {};
    const nativeExtension = options.nativeExtension || MentionOriginal;
    delete options.nativeExtension;

    const buttonDefs: MentionToolbarButtons = [];

    if (Object.prototype.hasOwnProperty.call(options, "suggestions")) {
      options.suggestions = options.suggestions.map((suggestion: any) => {
        const menu = suggestion.menu;
        delete suggestion.menu;

        if (suggestion.button) {
          buttonDefs.push({
            char: (suggestion.char || "@") as string,
            icon: suggestion.button.icon,
            tooltip: suggestion.button.tooltip,
          });
          delete suggestion.button;
        }

        return Object.assign(
          {},
          createDefaultSuggestionOptions(menu),
          suggestion,
        );
      });
    } else if (Object.prototype.hasOwnProperty.call(options, "suggestion")) {
      const menu = options.suggestion.menu;
      delete options.suggestion.menu;

      if (options.suggestion.button) {
        buttonDefs.push({
          char: (options.suggestion?.char || "@") as string,
          icon: options.suggestion?.button?.icon,
          tooltip: options.suggestion?.button?.tooltip,
        });
        delete options.suggestion.button;
      }

      options.suggestion = Object.assign(
        {},
        createDefaultSuggestionOptions(menu),
        options.suggestion,
      );
    }

    super(options, nativeExtension);

    this.buttonDefinitions = buttonDefs;
  }

  get availableActions(): ExtensionActionInterface[] {
    const nativeExtensionName = this.nativeExtensionInstance.name;

    return this.buttonDefinitions
      .filter((buttonDef) => buttonDef.char === "@" || buttonDef.icon)
      .map((buttonDef) => {
        const icons = buttonDef.icon
          ? {
              [VuetifyIconsGroups.md]: new VuetifyIcon(buttonDef.icon),
              [VuetifyIconsGroups.fa]: new VuetifyIcon(buttonDef.icon),
              [VuetifyIconsGroups.mdi]: new VuetifyIcon(buttonDef.icon),
              [VuetifyIconsGroups.mdiSvg]: new VuetifyIcon(buttonDef.icon),
            }
          : {
              [VuetifyIconsGroups.md]: new VuetifyIcon("alternate_email"),
              [VuetifyIconsGroups.fa]: new VuetifyIcon("fas fa-at"),
              [VuetifyIconsGroups.mdi]: new VuetifyIcon("mdi-at"),
              [VuetifyIconsGroups.mdiSvg]: new VuetifyIcon(
                "M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,10.5 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M12,2C14.75,2 17.1,3 19.05,4.95C21,6.9 22,9.25 22,12V13.45C22,14.45 21.65,15.3 21,16C20.3,16.67 19.5,17 18.5,17C17.3,17 16.31,16.5 15.56,15.5C14.56,16.5 13.38,17 12,17C10.63,17 9.45,16.5 8.46,15.54C7.5,14.55 7,13.38 7,12C7,10.63 7.5,9.45 8.46,8.46C9.45,7.5 10.63,7 12,7C13.38,7 14.55,7.5 15.54,8.46C16.5,9.45 17,10.63 17,12V13.45C17,13.86 17.16,14.22 17.46,14.53C17.76,14.84 18.11,15 18.5,15C18.92,15 19.27,14.84 19.57,14.53C19.87,14.22 20,13.86 20,13.45V12C20,9.81 19.23,7.93 17.65,6.35C16.07,4.77 14.19,4 12,4C9.81,4 7.93,4.77 6.35,6.35C4.77,7.93 4,9.81 4,12C4,14.19 4.77,16.07 6.35,17.65C7.93,19.23 9.81,20 12,20H17V22H12C9.25,22 6.9,21 4.95,19.05C3,17.1 2,14.75 2,12C2,9.25 3,6.9 4.95,4.95C6.9,3 9.25,2 12,2Z",
              ),
            };

        return {
          render: new ExtensionActionRenderBtn({
            tooltip:
              buttonDef.tooltip ||
              new I18nText("extensions.Mention.buttons.tooltip"),
            icons: icons,
            nativeExtensionName,
            async onClick({ editor }: { editor: Editor }) {
              const { state } = editor.view;
              const { $from } = state.selection;
              const before = $from.nodeBefore?.textContent;

              let text = buttonDef.char;
              if (typeof before === "string" && before.slice(-1) !== " ") {
                text = " " + text;
              }
              editor
                .chain()
                .focus()
                .insertContent({ type: "text", text })
                .run();
              editor.view.dom.dispatchEvent(
                new KeyboardEvent("keydown", {
                  key: buttonDef.char,
                  bubbles: true,
                }),
              );
            },
          }),
        };
      });
  }
}
