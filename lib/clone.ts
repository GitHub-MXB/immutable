/**
 * 浅复制一个对象，当前版本对象容器仅支持 Array,Set,Map,Object 类型
 * @param target 目标对象
 */
let assign = (target: any[] | object): object | any[] => {
    if (target instanceof Array) return target.concat()
    if (target instanceof Map) return new Map(target)
    if (target instanceof Set) return new Set(target)
    return Object.assign({}, Object(target))
}

type mapType<T> = Map<any, { parent: T; key: string | number | symbol }>

/**
 * 深度克隆一个对象
 * @param target 目标对象
 * @param callback 回调操作
 */
function deepClone<T extends object>(target: T, callback: (x: T) => any) {
    let map: mapType<T> = new Map() //储存
    let real = assign(target) //浅克隆目标对象
    callback.call(real, Clone.create(<T>real, map)) //执行回调，实际监听real对象
    return real
}

class Clone<T extends object> {
    proxy: T //用于储存Proxy对象
    constructor(obj: T, map: mapType<T>) {
        let clone = new Proxy(obj, {
            get(target, prop) {
                let val = target[prop]
                map.set(val, { parent: target, key: prop }) //将读取的值储存，set时，会修改该值
                switch (typeof val) {
                    case "object":
                        target[prop] = assign(val) //将读取的值浅克隆并替换
                        return Clone.create(target[prop], map) //返回代理的值
                    case "function":
                        return val.bind(target)
                    default:
                        return val
                }
            },
            set(target, prop, value) {
                let obj = map.get(target) //获取这个值有没有get过，若有，将要设置的对象浅克隆并替换，然后赋值
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
