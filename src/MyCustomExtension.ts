import type ExtensionActionInterface from '@/extensions/actions/ExtensionActionInterface'
import type { Editor } from '@tiptap/vue-2'

import { VuetifyIconsGroups } from '@/configs/theme'
import AbstractExtension from '@/extensions/AbstractExtension'
import ExtensionActionRenderBtn from '@/extensions/actions/renders/btn/ExtensionActionRenderBtn'
import VuetifyIcon from '@/extensions/nativeExtensions/icons/VuetifyIcon'

// A class must inherit from an abstract class
export default class MyCustomExtension extends AbstractExtension {
  // Our custom class property. It's not necessary.
  isEditable?: boolean

  // Actions list
  get availableActions(): ExtensionActionInterface[] {
    // For example, you can make this extension add a several buttons (array items)
    return [
      {
        render: new ExtensionActionRenderBtn({
          tooltip: (context, options) =>
            options.isActive(context) ? 'Make read-only' : 'Disable read-only',
          // Button's icons for different icons groups. Usually for your extensions you only need one kind of icon,
          // but here is an example of how to make support for two types
          icons: {
            [VuetifyIconsGroups.fa]: new VuetifyIcon('fas fa-lock'),
            [VuetifyIconsGroups.mdi]: new VuetifyIcon('mdi-cancel'),
          },
          // Button's click handler
          onClick: ({ editor }) => {
            this.isEditable = !editor.options.editable

            editor.setOptions({
              editable: this.isEditable,
            })
          },
          // Is the button active? This affects the style of the button.
          isActive: () => {
            return !this.isEditable
          },
        }),
      },
    ]
  }

  // Editor initialization hook, here you can access the Editor
  onEditorInit(editor: Editor) {
    this.isEditable = editor.options.editable
  }
}
