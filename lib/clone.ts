/**
 *
 * Shallow copy an object. The current version of the object container only supports array, set, map and object types
 *
 * 浅复制一个对象，当前版本对象容器仅支持 Array,Set,Map,Object 类型
 * @param target Target object 目标对象
 */
let assign = (target: any[] | object): object | any[] => {
    if (target instanceof Array) return target.concat()
    if (target instanceof Map) return new Map(target)
    if (target instanceof Set) return new Set(target)
    return Object.assign({}, Object(target))
}

type mapType<T> = Map<any, { parent: T; key: string | number | symbol }>

/**
 * Deep clone an object
 * 深度克隆一个对象
 * @param target
 * @param callback
 */
function deepClone<T extends object>(target: T, callback: (x: T) => any) {
    let map: mapType<T> = new Map() //Store target and its real address 储存 target 和其真实地址
    let real = assign(target) //Shallow clone target object is real object 浅克隆目标对象为 real 对象
    callback.call(real, Clone.create(<T>real, map)) // Actually listening to real objects. 执行回调，实际监听real对象
    return real
}

class Clone<T extends object> {
    proxy: T //Used to store proxy objects  用于储存Proxy对象
    constructor(obj: T, map: mapType<T>) {
        let clone = new Proxy(obj, {
            get(target, prop) {
                let val = target[prop]
                map.set(val, { parent: target, key: prop }) //Store Val and its real address, which will be used in set 将 val 与其真实地址储存，set 时会用到
                switch (typeof val) {
                    case "object":
                        target[prop] = assign(val)
                        //The read value is shallowly cloned and assigned, and the new proxy object is returned  将读取的值浅克隆并赋值，返回新的代理对象
                        return Clone.create(target[prop], map)
                    case "function":
                        return val.bind(target)
                    default:
                        return val
                }
            },
            set(target, prop, value) {
                let obj = map.get(target) //When set is triggered, get the real address of target (the value of target cannot be assigned directly)  触发 set 时，获取 target 的真实地址（target 的值不能直接赋值），
                if (obj) {
                    let { parent, key } = obj
                    parent[key] = assign(target)
                    parent[key][prop] = value
                } else {
                    target[prop] = value
                }
                return true
            },
        })
        this.proxy = clone
    }
    static create<T extends object>(obj: T, map: mapType<T>) {
        return new Clone<T>(obj, map).proxy
    }
}

export default deepClone
