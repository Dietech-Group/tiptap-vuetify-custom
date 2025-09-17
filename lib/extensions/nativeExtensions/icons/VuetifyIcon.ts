import type IconInterface from "@/extensions/nativeExtensions/icons/IconInterface";

export default class VuetifyIcon implements IconInterface {
  constructor(public name: string) {}

  toString() {
    return this.name;
  }
}
