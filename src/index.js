import { validate } from 'schema-utils';

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
    const {types} = this;
    compiler.hooks.emit.tap(pluginName, (compilation) => {
      // eslint-disable-next-line guard-for-in
      for (const name in compilation.assets) {
        if (this.options.test.test(name)) {
          const asset = compilation.assets[name];
          const contents = asset.source();
          if (typeof contents === 'string') {
            const syntax = ['console', 'window.console'];
            const consoleReg = new RegExp(
              `(${syntax.join('|')}).(?:${types.join(
                '|'
              )})\\s{0,}\\([^;]*\\)(?!\\s*[;,]?\\s*\\/\\*\\s*\\s*\\*\\/)\\s{0,};?`,
              'gi'
            );
            const noConsoles = contents.replace(consoleReg, '');
            // @ts-ignore
            compilation.assets[name] = {
              source: () => noConsoles,
              size: () => noConsoles.length,
            };
          }
        }
      }
    });
  }
}

module.exports = RmConsoleWebpackPlugin;
