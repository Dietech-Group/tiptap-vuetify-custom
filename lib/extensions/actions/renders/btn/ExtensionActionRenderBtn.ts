import type { ExtensionActionRenderBtnOptionsInterface } from "@/extensions/actions/renders/btn/ExtensionActionRenderBtnOptionsInterface";
import { UnionCommands } from "@tiptap/core";

type OptionalOptionsType = "onClick" | "isActive";

export default class ExtensionActionRenderBtn {
  options: ExtensionActionRenderBtnOptionsInterface;

  constructor(
    options: Omit<
      ExtensionActionRenderBtnOptionsInterface,
      OptionalOptionsType
    > &
      Partial<
        Pick<ExtensionActionRenderBtnOptionsInterface, OptionalOptionsType>
      >,
  ) {
    const nativeExtensionName = options.nativeExtensionName!;

    this.options = {
      onClick({ editor }) {
        if (options.onClickCommand) {
          (
            editor.chain().focus()[
              options.onClickCommand as keyof UnionCommands
            ] as any
          )(options.onClickOptions)?.run();
        }
      },
      isActive(editor) {
        return editor.isActive(nativeExtensionName, options.isActiveOptions);
      },
      ...options,
    };
  }
}
