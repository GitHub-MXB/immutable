# immutable

## 介绍

1. 使用简单的逻辑实现了一个 API，仅修改值时进行复制，最大限度地减少了复制或缓存数据的需求。
2. 始终产生新的更新数据，不改变原有数据。
3. [https://github.com/GitHub-MXB/immutable](https://github.com/GitHub-MXB/immutable)

## 软件原理

### 使用 Proxy 响应更新,仅 get 和 set 时浅克隆操作对象并赋值

1. 创建一个 Map 集合用来储存 target 和其真实地址
2. 浅克隆目标对象为 real 对象
3. 执行回调，实际监听 real 对象。
4. 触发 get 时，将 val 与其真实地址储存，set 时会用到
5. 将读取的值浅克隆并赋值，返回新的代理对象
6. 触发 set 时，获取 target 的真实地址（target 的值不能直接赋值），若有：进行第 5 步，若没有：直接赋值

## 安装教程

```
import deepClone from "@personal_simple_code/immutable"

let obj = {
    a: [1, 2, 3, 4, 5],
    b: { c: [123] },
    d: new Map(),
    e: new Set(),
}
let a = deepClone(obj, (x) => {
    x.a = [0, 0, 0]
    x.a[0] = 100
    x.a[1]++
    x.a[0] += x.a[1] + 100

    x.a.push(0)
    x.d.set("a", {
        a: 100,
    })
    x.e.add(1089)
    x.e.add(x.d.get("a"))
    x["f"] = {
        a: x.e,
    }
})

console.error(`原始值:`, obj)
console.error(`结果:`, a)

```

## 结果

```
原始值: { a: [ 1, 2, 3, 4, 5 ], b: { c: [ 123 ] }, d: Map {}, e: Set {} }
结果: {
  a: [ 201, 1, 0, 0 ],
  b: { c: [ 123 ] },
  d: Map { 'a' => { a: 100 } },
  e: Set { 1089, { a: 100 } },
  f: { a: Set { 1089, [Object] } }
}
```

## 使用说明

1. 当前版本对象容器仅支持 Array,Set,Map,Object 类型
2. 回调函数内的取值,赋值均为直接复制，没有引用关系
