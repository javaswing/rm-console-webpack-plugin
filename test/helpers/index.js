import compile from "./compile";
import getCompiler from "./getCompiler";
import readAsset from "./readAsset";
import readAssets from "./readAssets";


export function removeCWD(str) {
  return str.split(`${process.cwd()}/`).join('');
}

export function cleanErrorStack(error) {
  return removeCWD(error.toString())
    .split('\n')
    .slice(0, 2)
    .join('\n');
}

export { compile, getCompiler, readAsset, readAssets };
