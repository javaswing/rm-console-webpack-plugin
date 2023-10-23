import { validate } from 'schema-utils';
import {Compilation as WebpackCompilation} from 'webpack';

const schema = require('./schema.json');

const pluginName = 'RmConsoleWebpackPlugin';

/** @typedef {import("schema-utils/declarations/validate").Schema} Schema */
/** @typedef {import('webpack').Compiler} Compiler */
/** @typedef {import("webpack").Compilation} Compilation */
/** @typedef {Object} PluginOptions */

class RmConsoleWebpackPlugin {
  /**
   * 构造函数
   *
   * @param {PluginOptions} options
   */
  constructor(options = {}) {
    validate(/** @type {Schema} */ (schema), options, {
      name: pluginName,
      baseDataPath: 'options',
    });
    // @ts-ignore
    const { test = /\.js(\?.*)?$/i } = options;
    this.types = [
      'log',
      'info',
      'warn',
      'error',
      'assert',
      'count',
      'clear',
      'group',
      'groupEnd',
      'groupCollapsed',
      'trace',
      'debug',
      'dir',
      'dirxml',
      'profile',
      'profileEnd',
      'time',
      'timeEnd',
      'timeStamp',
      'table',
      'exception',
    ];
    this.options = {
      test,
    };
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
    const { types } = this;
    compiler.hooks.emit.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          // @ts-ignore
          stage: WebpackCompilation.PROCESS_ASSETS_STAGE_DEV_TOOLING,
          additionalAssets: true,
        },
        (assets) => this.dropConsole(assets, compilation)
      );
    });
  }

  /**
   * @param {import("webpack").Compilation} compilation
   */
  // @ts-ignore
  dropConsole(assets, compilation) {
    const assetKeys = Object.keys(assets);
    for (const key of assetKeys) {
      if (this.options.test.test(key)) {
        let contents = assets[key].source();
        const syntax = ['console', 'window.console'];
        const consoleReg = new RegExp(
          `(${syntax.join('|')}).(?:${this.types.join(
            '|'
          )})\\s{0,}\\([^;]*\\)(?!\\s*[;,]?\\s*\\/\\*\\s*\\s*\\*\\/)\\s{0,};?`,
          'gi'
        );
        const noConsoles = contents.replace(consoleReg, '');
        // @ts-ignore
        compilation.assets[key] = {
          source: () => noConsoles,
          size: () => noConsoles.length,
        };
      }
    }
  }
}

module.exports = RmConsoleWebpackPlugin;
