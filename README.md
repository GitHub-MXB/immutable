# immutable

## Introduction

1. A simple logic is used to implement an API to copy only when modifying values, which minimizes the need to copy or cache data.

2. Always generate new updated data without changing the original data.

## Software principle

### Use proxy response to update, only get and set time shallow clone operands and assign values

1. Create a map set to store target and its real address

2. Shallow clone target object is real object

3. Execute the callback and actually listen to the real object.

4. When the get is triggered, the Val and its real address are stored, which is used in the set

5. Shallow clone and assign the read value, and return the new proxy object

6. When the set is triggered, obtain the real address of the target (the value of the target cannot be assigned directly). If there is: go to step 5, if there is no: assign directly

## Installation tutorial

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

console.error(`target:`, obj)
console.error(`result:`, a)

```

## result

```
target: { a: [ 1, 2, 3, 4, 5 ], b: { c: [ 123 ] }, d: Map {}, e: Set {} }
result: {
  a: [ 201, 1, 0, 0 ],
  b: { c: [ 123 ] },
  d: Map { 'a' => { a: 100 } },
  e: Set { 1089, { a: 100 } },
  f: { a: Set { 1089, [Object] } }
}
```

## Instructions for use

1. The current version of object container only supports array, set, map and object types

2. The values and assignments in the callback function are all directly copied and have no reference relationship
