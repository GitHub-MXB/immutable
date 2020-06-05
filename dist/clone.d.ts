/**
 * 深度克隆一个对象
 * @param target 目标对象
 * @param callback 回调操作
 */
declare function deepClone<T extends object>(target: T, callback: (x: T) => any): object | any[];
export default deepClone;
