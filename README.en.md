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

1. xxxx

2. xxxx

3. xxxx

## Instructions for use

1. The current version of object container only supports array, set, map and object types

2. The values and assignments in the callback function are all directly copied and have no reference relationship
