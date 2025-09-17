import type IconInterface from "@/extensions/nativeExtensions/icons/IconInterface";

export default class TextIcon implements IconInterface {
  constructor(public text: string) {}

  toString() {
    return this.text;
  }
}
