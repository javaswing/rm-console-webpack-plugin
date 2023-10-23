import path from "path";

// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from "webpack";
// eslint-disable-next-line import/no-extraneous-dependencies
import { createFsFromVolume, Volume } from "memfs";

export default (config = {}) => {
  const fullConfig = {
    mode: "development",
    entry: path.resolve(__dirname, "../fixtures/index.js"),
    output: {
      path: path.resolve(__dirname, "../build"),
      filename: '[name].[chunkhash].js',
      chunkFilename: '[id].[name].[chunkhash].js'
    },
    ...config,
  };

  const compiler = webpack(fullConfig);

  if (!config.outputFileSystem) {
    const outputFileSystem = createFsFromVolume(new Volume());
    // Todo remove when we drop webpack@4 support
    outputFileSystem.join = path.join.bind(path);

    compiler.outputFileSystem = outputFileSystem;
  }

  return compiler;
};
