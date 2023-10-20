import path from "path";

import webpack from "webpack";
import { createFsFromVolume, Volume } from "memfs";

import RmConsoleWebpackPlugin from "../src/index";

import { readAssets, compile } from "./helpers";

// const FIXTURES_DIR = path.join(__dirname, "fixtures");


describe("RmConsoleWebpackPlugin", () => {
  it("should work", async () => {
    const compiler = webpack([
      {
        mode: "development",
        context: path.resolve(__dirname, "./fixtures"),
        entry: path.resolve(__dirname, "./helpers/enter.js"),
        output: {
          path: path.resolve(__dirname, "./outputs/dist/a"),
        },
        stats: {
          source: true,
        },
        plugins: [
          new webpack.ProgressPlugin(),
          new RmConsoleWebpackPlugin({
            patterns: [
              {
                from: path.resolve(__dirname, "./fixtures/directory"),
              },
            ],
          }),
        ],
      }
    ]);

    compiler.compilers.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.outputFileSystem = createFsFromVolume(new Volume());
    });

    const { stats } = await compile(compiler);

    stats.stats.forEach((item, index) => {
      expect(item.compilation.errors).toMatchSnapshot("errors");
      expect(item.compilation.warnings).toMatchSnapshot("warnings");
      expect(readAssets(compiler.compilers[index], item)).toMatchSnapshot(
        "assets"
      );
    });
  });
})
