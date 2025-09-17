import { PACKAGE_NAME } from "@/const";

class ConsoleLogger {
  warn(msg?: any) {
    console.warn(`${PACKAGE_NAME}: ${msg}`);
  }

  error(msg?: any) {
    console.error(`${PACKAGE_NAME}: ${msg}`);
  }
}

export default new ConsoleLogger();
