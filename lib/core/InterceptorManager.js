'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * 添加拦截器到数组栈中
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} 返回 ID, 后续可用来取消拦截器
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * 从栈中去除拦截器（利用 use 返回的 Id , 其实是栈中索引）
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * 迭代所有已注册的拦截器
 *
 * 这个方法对于跳过那些通过调用 eject 去除的
 * 拦截器，此时在栈中为 null,特别有用
 *
 * @param {Function} fn The function to call for each interceptor
 */

/**
 * mark: fn 作为 forEach 方法的函数参数
 *  内部调用 utils.forEach，用于迭代栈数据（this.handlers）
 *  每次迭代调用 forEachHandler 函数
 *  进而每次都调用 fn 函数
 * 总结：迭代栈，每次迭代栈数据当作 fn 参数，执行 fn 函数
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;
