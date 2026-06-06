'use strict';
let __defProp = Object.defineProperty;
let __getOwnPropDesc = Object.getOwnPropertyDescriptor;
let __getOwnPropNames = Object.getOwnPropertyNames;
let __hasOwnProp = Object.prototype.hasOwnProperty;
let __export = (target, all) => {
  for (let name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
let __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
let __toCommonJS = (mod) =>
  __copyProps(__defProp({}, '__esModule', { value: true }), mod);

// src/.umi/api/_middlewares.ts
let middlewares_exports = {};
__export(middlewares_exports, {
  default: () => middlewares_default,
});
module.exports = __toCommonJS(middlewares_exports);
var middlewares_default = async (req, res, next) => {
  next();
};
