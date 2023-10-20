import { validate } from "schema-utils";

const schema = require("./schema.json");

const pluginName = "RmConsoleWebpackPlugin";

/** @typedef {import("schema-utils/declarations/validate").Schema} Schema */
/** @typedef {import('webpack').Compiler} Compiler */
/** @typedef {import("webpack").Compilation} Compilation */

/**
 * 一个WebpackPlugin, 就是一个Javascript类
 */
class RmConsoleWebpackPlugin {
  /**
   * 构造函数
   * @typedef {Object} PluginOptions
   *
   * @param {PluginOptions} options
   */
  constructor(options = {}) {
    validate(/** @type {Schema} */ (schema), options, {
      name: "RmConsoleWebpackPlugin",
      baseDataPath: "options",
    });
  }

  /**
   * apply 方法
   *
   * @param {Compiler} compiler
   * @description 该方法在安装插件时，会被`webpack complier`调用
   *
   */
  // eslint-disable-next-line class-methods-use-this
  apply(compiler) {
    // eslint-disable-next-line no-unused-vars
    compiler.hooks.done.tap(pluginName, (stats) => {
      console.log("Hello World");
    });
  }
}

module.exports = RmConsoleWebpackPlugin;
