---
title: ES2015+
category: JavaScript
updated: 2019-11-14
column_size: 2
intro: A quick overview of new JavaScript features in ES2015, ES2016, ES2017, ES2018 and beyond.
---

### 块作用域

#### Let

```js
function fn () {
  let x = 0
  if (true) {
    let x = 1 // 只在`if`条件块内
  }
}
```

#### Const

```js
const a = 1
```

`let`是新版本的`var`，`const`与`let`类似，但无法重新分配。
查看: [Let and const](https://babeljs.io/learn-es2015/#let--const)

### 反引号

#### 字符串模板

```js
const message = `Hello ${name}`
```

#### 多行文本

```js
const str = `
hello
world
`
```

字符串模板和多行文本。
查看: [Template strings](https://babeljs.io/learn-es2015/#template-strings)

### 二进制和八进制

```js
let bin = 0b1010010
let oct = 0o755
```

查看: [Binary and octal literals](https://babeljs.io/learn-es2015/#binary-and-octal-literals)

### 新方法

#### string的新方法

```js
"hello".repeat(3)
"hello".includes("ll")
"hello".startsWith("he")
"hello".padStart(8) // "   hello"
"hello".padEnd(8) // "hello   " 
"hello".padEnd(8, '!') // hello!!!
"\u1E9B\u0323".normalize("NFC")
```

更多: [New methods](https://babeljs.io/learn-es2015/#math--number--string--object-apis)

### 类

```js
class Circle extends Shape {
```

#### 构造器

```js
  constructor (radius) {
    this.radius = radius
  }
```

#### 方法

```js
  getArea () {
    return Math.PI * 2 * this.radius
  }
```

#### 调用父类方法

```js
  expand (n) {
    return super.expand(n) * Math.PI
  }
```

#### 静态方法

```js
  static createFromDiameter(diameter) {
    return new Circle(diameter / 2)
  }
}
```

原型的语法糖，
查看: [Classes](https://babeljs.io/learn-es2015/#classes)

### 指数计算

```js
const byte = 2 ** 8
// Same as: Math.pow(2, 8)
```

## Promises

### 创建 promises

```js
new Promise((resolve, reject) => {
  if (ok) { resolve(result) }
  else { reject(error) }
})
```

更多异步操作，查看: [Promises](https://babeljs.io/learn-es2015/#promises)

### 使用 promises

```js
promise
  .then((result) => { ··· })
  .catch((error) => { ··· })
```
{: data-line="2,3"}


### promises 使用 finally

```js
promise
  .then((result) => { ··· })
  .catch((error) => { ··· })
  .finally(() => { ... })
```

无论`promise`最终状态如何，`finally`都会执行。

### Promise 方法

```js
Promise.all(···)
Promise.race(···)
Promise.reject(···)
Promise.resolve(···)
```

### Async-await

```js
async function run () {
  const user = await getUser()
  const tweets = await getTweets(user)
  return [user, tweets]
}
```

`await`必须在`async`内部，不能单独使用。
更多: [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

## 解构

### 解构赋值

#### Arrays

```js
const [first, last] = ['Nikola', 'Tesla']
```

#### Objects

```js
let {title, author} = {
  title: 'The Silkworm',
  author: 'R. Galbraith'
}
```

更多: [Destructuring](https://babeljs.io/learn-es2015/#destructuring)

### 默认值

```js
const scores = [22, 33]
const [math = 50, sci = 50, arts = 50] = scores
```

```js
// Result:
// math === 22, sci === 33, arts === 50
```

解构数组或对象时可以分配默认值。

### 方法参数

```js
function greet({ name, greeting }) {
  console.log(`${greeting}, ${name}!`)
}
```

```js
greet({ name: 'Larry', greeting: 'Ahoy' })
```

对象和数组的解构也可以在方法参数中完成。

### 方法参数默认值

```js
function greet({ name = 'Rauno' } = {}) {
  console.log(`Hi ${name}!`);
}
```

```js
greet() // Hi Rauno!
greet({ name: 'Larry' }) // Hi Larry!
```

### 为key重新赋值

```js
function printCoordinates({ left: x, top: y }) {
  console.log(`x: ${x}, y: ${y}`)
}
```

```js
printCoordinates({ left: 25, top: 90 })
```

本例将key`left`的值赋予`x`。

### 循环

```js
for (let {title, artist} of songs) {
  ···
}
```
赋值表达式在循环中一样可以使用。


### 对象结构

```js
const { id, ...detail } = song;
```

使用余下的（...）运算符，逐一提取剩余的key。


## 扩展运算

### 对象扩展

#### 使用对象扩展

```js
const options = {
  ...defaults,
  visible: true
}
```

#### 不使用对象扩展

```js
const options = Object.assign(
  {}, defaults,
  { visible: true })
```

对象扩展运算可以从其他对象构建新对象。
更多: [Object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator)

### 数组扩展

#### 使用数组扩展

```js
const users = [
  ...admins,
  ...editors,
  'rstacruz'
]
```

#### 不使用数组扩展

```js
const users = admins
  .concat(editors)
  .concat([ 'rstacruz' ])
```

扩展运算可以用相同的方式构建新数组。

查看: [Spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator)

## 函数

### 参数

#### 参数默认值

```js
function greet (name = 'Jerry') {
  return `Hello ${name}`
}
```
#### 余下的参数

```js
function fn(x, ...y) {
  // y is an Array
  return x * y.length
}
```

#### 扩展

```js
fn(...[1, 2, 3])
// same as fn(1, 2, 3)
```

默认, 余下和扩展。
查看: [Function arguments](https://babeljs.io/learn-es2015/#default--rest--spread)

### 箭头函数

#### 箭头函数

```js
setTimeout(() => {
  ···
})
```

#### 带参数

```js
readFile('text.txt', (err, data) => {
  ...
})
```

#### 隐式返回
```js
numbers.map(n => n * 2)
// 没有大括号 = 隐式返回
// 等于: numbers.map(function (n) { return n * 2 })

numbers.map(n => ({ result: n * 2 }))
// 隐式返回对象需要在对象周围加上括号
```

类似于函数，除非类似`func.call(this)`调用，否则不会产生新的`this`，
查看: [Fat arrows](https://babeljs.io/learn-es2015/#arrows-and-lexical-this)

## 对象

### 速记语法

```js
module.exports = { hello, bye }
// 等于: module.exports = { hello: hello, bye: bye }
```

更多: [Object literal enhancements](https://babeljs.io/learn-es2015/#enhanced-object-literals)

### 方法

```js
const App = {
  start () {
    console.log('running')
  }
}
// 等于: App = { start: function () {···} }
```

更多: [Object literal enhancements](https://babeljs.io/learn-es2015/#enhanced-object-literals)

### Getters 和 setters

```js
const App = {
  get closed () {
    return this.status === 'closed'
  },
  set closed (value) {
    this.status = value ? 'closed' : 'open'
  }
}
```

更多: [Object literal enhancements](https://babeljs.io/learn-es2015/#enhanced-object-literals)

### 计算属性名

```js
let event = 'click'
let handlers = {
  [`on${event}`]: true
}
// 等于: handlers = { 'onclick': true }
```

更多: [Object literal enhancements](https://babeljs.io/learn-es2015/#enhanced-object-literals)


### 提取值

```js
const fatherJS = { age: 57, name: "Brendan Eich" }

Object.keys(fatherJS)     
// ["age", "name"]
Object.values(fatherJS)
// [57, "Brendan Eich"]
Object.entries(fatherJS)
// [["age", 57], ["name", "Brendan Eich"]]
```

## 模块

### 导入

```js
import 'helpers'
// aka: require('···')
```

```js
import Express from 'express'
// aka: const Express = require('···').default || require('···')
```

```js
import { indent } from 'helpers'
// aka: const indent = require('···').indent
```

```js
import * as Helpers from 'helpers'
// aka: const Helpers = require('···')
```

```js
import { indentSpaces as indent } from 'helpers'
// aka: const indent = require('···').indentSpaces
```

`import` 是新版 `require()`。
更多: [Module imports](https://babeljs.io/learn-es2015/#modules)

### 导出

```js
export default function () { ··· }
// aka: module.exports.default = ···
```

```js
export function mymethod () { ··· }
// aka: module.exports.mymethod = ···
```

```js
export const pi = 3.14159
// aka: module.exports.pi = ···
```

`export` 是新版 `module.exports`。
更多: [Module exports](https://babeljs.io/learn-es2015/#modules)

## Generators

### Generators

```js
function* idMaker () {
  let id = 0
  while (true) { yield id++ }
}
```

```js
let gen = idMaker()
gen.next().value  // → 0
gen.next().value  // → 1
gen.next().value  // → 2
```

很复杂，
查看: [Generators](https://babeljs.io/learn-es2015/#generators)

### For..of 遍历

```js
for (let i of iterable) {
  ···
}
```

更多: [For..of iteration](https://babeljs.io/learn-es2015/#iterators--forof)
