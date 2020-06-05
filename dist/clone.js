"use strict";
exports.__esModule = true;
/**
 * 浅复制一个对象，目前仅可处理普通对象和数组
 * @param target 目标对象
 */
var assign = function (target) {
    return target instanceof Array ? target.concat() : Object.assign({}, target);
};
/**
 * 深度克隆一个对象
 * @param target 目标对象
 * @param callback 回调操作
 */
function deepClone(target, callback) {
    var map = new Map(); //储存
    var real = assign(target); //浅克隆目标对象
    callback.call(real, Clone.create(real, map)); //执行回调，实际监听real对象
    return real;
}
var Clone = /** @class */ (function () {
    function Clone(obj, map) {
        var clone = new Proxy(obj, {
            get: function (target, prop) {
                var val = target[prop];
                map.set(val, { parent: target, key: prop }); //将读取的值储存，set时，会修改该值
                switch (typeof val) {
                    case "object":
                        target[prop] = assign(val); //将读取的值浅克隆并替换
                        return Clone.create(target[prop], map); //返回代理的值
                    case "function":
                        return val.bind(target);
                    default:
                        return val;
                }
            },
            set: function (target, prop, value) {
                var obj = map.get(target); //获取这个值有没有get过，若有，将要设置的对象浅克隆并替换，然后赋值
                if (obj) {
                    var parent_1 = obj.parent, key = obj.key;
                    parent_1[key] = assign(target);
                    parent_1[key][prop] = value;
                }
                else {
                    target[prop] = value;
                }
                return true;
            }
        });
        this.proxy = clone;
    }
    Clone.create = function (obj, map) {
        return new Clone(obj, map).proxy;
    };
    return Clone;
}());
exports["default"] = deepClone;
