
import RmConsoleWebpackPlugin from "../src/index";

import { compile, getCompiler, cleanErrorStack } from "./helpers/index";

describe("RmConsoleWebpackPlugin", () => {
  it("test rm console", () => {
    const compiler = getCompiler();

    new RmConsoleWebpackPlugin({}).apply(compiler);
    return compile(compiler).then(({ stats }) => {
      const errors = stats.compilation.errors.map(cleanErrorStack);
      const warnings = stats.compilation.warnings.map(cleanErrorStack);

      expect(errors).toMatchSnapshot("errors");
      expect(warnings).toMatchSnapshot("warnings");

      for (const file in stats.compilation.assets) {
        if (
          Object.prototype.hasOwnProperty.call(stats.compilation.assets, file)
        ) {
          console.log('file', stats.compilation.assets[file])
          expect(stats.compilation.assets[file].size()).toMatchSnapshot(file);
        }
      }
    });
  });
});
