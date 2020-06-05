/**
 * Deep clone an object
 * 深度克隆一个对象
 * @param target
 * @param callback
 */
declare function deepClone<T extends object>(target: T, callback: (x: T) => any): object | any[];
export default deepClone;
