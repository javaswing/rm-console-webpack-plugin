import RmConsoleWebpackPlugin from "../src/index";

import { compile, getCompiler } from "./helpers/index";

describe("RmConsoleWebpackPlugin", () => {
  it("should work", async () => {
    const compiler = getCompiler();

    new RmConsoleWebpackPlugin().apply(compiler);

    const { stats } = await compile(compiler);
    expect(stats.compilation.errors).toMatchSnapshot("errors");
    expect(stats.compilation.warnings).toMatchSnapshot("warnings");
  });
});
