---
title: golang
category: Go
updated: 2020-12-07
column_size: 2
---

### Credits

大部分例子来源于[A Tour of Go](http://tour.golang.org/), 是`Go`非常优秀的入门教程，如果你是新手，建议你先看看这个教程。

### 简述

-   命令式语言
-   静态类型
-   类似于`C`的语法标记（但括号较少且没有分号），其结构类似于`Oberon-2`
-   编译为原生代码（无虚拟机）
-   没有类，但有带方法的结构
-   接口
-   没有实现继承。 不过，有[类型嵌入](http://golang.org/doc/effective%5Fgo.html#embedding)。
-   函数是最重要的部分
-   函数可以返回多个值
-   闭包
-   指针，但没有指针算术
-   内置并发元支持：`Goroutine`和`Channels`

### Hello World

File `hello.go`:

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello Go")
}
```

`$ go run hello.go`

## 操作符

### 算术运算

| Operator | Description                |
| -------- | -------------------------- |
| `+`      | 加                         |
| `-`      | 减                         |
| `*`      | 乘                         |
| `/`      | 除                         |
| `%`      | 余                         |
| `&`      | 按位与                     |
| `\|`     | 按位或                     |
| `^`      | 按位异或                   |
| `&^`     | 与非，`a &^ b == a & (^b)` |
| `<<`     | 左移，`*2`                 |
| `>>`     | 右移，`/2`                 |

### 对比

| Operator | Description |
| -------- | ----------- |
| `==`     | 等于        |
| `!=`     | 不等于      |
| `<`      | 小于        |
| `<=`     | 小于等于    |
| `>`      | 大于        |
| `>=`     | 大于等于    |

### 逻辑运算

| Operator | Description |
| -------- | ----------- |
| `&&`     | 与          |
| `\|\|`   | 或          |
| `!`      | 非          |

### 其他

| Operator | Description         |
| -------- | ------------------- |
| `&`      | 指针地址 / 创建指针 |
| `*`      | 取消引用指针        |
| `<-`     | 发送/接收运算       |

## 变量声明

类型在标识符之后

```go
var foo int // 未初始化声明
var foo int = 42 // 初始化声明
var foo, bar int = 42, 1302 // 多变量声明和初始化
var foo = 42 // 类型推断
foo := 42 // 简写，仅在func主体中，省略var关键字，类型始终为隐式
const constant = "这是一个常量"

//iota 递增计数，从0开始(遇到const归0)
//未初始化变量，默认等于上一变量
const (
    _ = iota
    a
    b
    c = 1 << iota
    d
)
    fmt.Println(a, b) // 1 2 (0 is skipped)
    fmt.Println(c, d) // 8 16 (2^3, 2^4)
```

## 函数

### init()函数

-   init 函数是用于程序执行前做包的初始化的函数，比如初始化包里的变量等
-   每个包可以拥有多个 init 函数
-   包的每个源文件也可以拥有多个 init 函数
-   同一个包中多个 init 函数的执行顺序 go 语言没有明确的定义(说明)
-   不同包的 init 函数按照包导入的依赖关系决定该初始化函数的执行顺序
-   init 函数不能被其他函数调用，而是在 main 函数执行之前，自动被调用

### main()函数
Go语言程序的默认入口函数(主函数)
```go
func main(){
    //函数体
}
```

### 函数定义

#### 一个简单的函数

```go
func functionName() {}
```

#### 带参数函数（同样的，类型在标识符之后）

```go
func functionName(param1 string, param2 int) {}
```

#### 同类型的多个参数

```go
func functionName(param1, param2 int) {}
```

#### 返回值类型声明

```go
func functionName() int {
    return 42
}
```

#### 返回多个参数

```go
func returnMulti() (int, string) {
    return 42, "foobar"
}
var x, str = returnMulti()
```

#### 只需通过 return 返回多个命名结果

```go
func returnMulti2() (n int, s string) {
    n = 42
    s = "foobar"
    // n 和 s 将被返回
    return
}
var x, str = returnMulti2()
```

### 函数作为值和闭包

```go
func main() {
    // 给函数分配名称
    add := func(a, b int) int {
        return a + b
    }
    // 通过名称调用函数
    fmt.Println(add(3, 4))
}
```

#### 闭包，字面作用域：定义函数时，函数可以访问作用域内的值

```go
func scope() func() int{
    outer_var := 2
    foo := func() int { return outer_var}
    return foo
}

func another_scope() func() int{
    // 无法编译，因为outer_var和foo不在本作用域内
    outer_var = 444
    return foo
}
```

#### 闭包

```go
func outer() (func() int, int) {
    outer_var := 2
    inner := func() int {
        outer_var += 99 // 外部作用域的outer_var被修改
        return outer_var
    }
    inner()
    return inner, outer_var // 返回 inner func 和 变化后的 outer_var 101
}
```

### 可变参数函数

```go
func main() {
	fmt.Println(adder(1, 2, 3)) 	// 6
	fmt.Println(adder(9, 9))	// 18

	nums := []int{10, 20, 30}
	fmt.Println(adder(nums...))	// 60
}
```

#### 通过在最后一个参数的类型名称前使用`...`，接受零个或多个参数。

```go
func adder(args ...int) int {
	total := 0
	for _, v := range args { // 变量所有参数
		total += v
	}
	return total
}
```

## 类型

### 内置类型

#### 值类型

```go
bool

string

int  int8  int16  int32  int64
uint uint8 uint16 uint32 uint64 uintptr

byte // 等同于uint8，常用来处理ascii字符

rune // rune 等同于int32，常用来处理unicode或utf-8字符

float32 float64

complex64 complex128
```

#### 引用类型（指针类型）

```go
slice   -- 序列数组(最常用)
map     -- 映射
chan    -- 管道
```

### 内置函数

| 方法           | 描述                                                                     |
| -------------- | ------------------------------------------------------------------------ |
| append         | 用来追加元素到数组、slice 中,返回修改后的数组、slice                     |
| close          | 主要用来关闭 channel                                                     |
| delete         | 从 map 中删除 key 对应的 value                                           |
| panic          | 停止常规的 goroutine （panic 和 recover：用来做错误处理）                |
| recover        | 允许程序定义 goroutine 的 panic 动作                                     |
| real           | 返回 complex 的实部 （complex、real imag：用于创建和操作复数）           |
| imag           | 返回 complex 的虚部                                                      |
| make           | 用来分配内存，返回 Type 本身(只能应用于 slice, map, channel)             |
| new            | 用来分配内存，主要用来分配值类型，比如 int、struct。返回指向 Type 的指针 |
| cap            | capacity 是容量的意思，用于返回某个类型的最大容量（只能用于切片和 map）  |
| copy           | 用于复制和连接 slice，返回复制的数目                                     |
| len            | 来求长度，比如 string、array、slice、map、channel ，返回长度             |
| print、println | 底层打印函数，在部署环境中建议使用 fmt 包                                |

### 结构 Struct

go 没有类`class`，只有结构`struct`，结构可以拥有方法。struct 是一种类型，也是成员变量的集合。

```go

// 声明
type Vertex struct {
    X, Y int
}

// 创建
var v = Vertex{1, 2}
var v = Vertex{X: 1, Y: 2}          // 带key创建
var v = []Vertex{{1,2},{5,2},{5,5}} // 初始化struct切片

// 访问成员
v.X = 4

// 在结构上声明方法，结构介于func关键字和方法名称之间。调用时，会复制strut的值。
func (v Vertex) Abs() float64 {
    return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

// 方法调用
v.Abs()

// 对于变异方法，需要使用指向struct的指针（见下文）作为类型。调用时，不会复制struct的值。
func (v *Vertex) add(n float64) {
    v.X += n
    v.Y += n
}

```

#### **匿名 struct:**，比`map[string]interface{}`更轻量和安全

```go
point := struct {
	X, Y int
}{1, 2}
```

### 指针

```go
p := Vertex{1, 2}  // p 是一个 Vertex
q := &p            // q 是一个指向Vertex的指针
r := &Vertex{1, 2} // r 是一个指向Vertex的指针
```

#### 指向 Vertex 的指针类型为 \*Vertex

```go
var s *Vertex = new(Vertex) // 创建一个指向Vertex实例的指针
```

### 类型转换

```go
var i int = 42
var f float64 = float64(i)
var u uint = uint(f)

// alternative syntax
i := 42
f := float64(i)
u := uint(f)
```

## Packages

-   每个源文件顶部声明包
-   可执行文件位于包`main`中
-   约定：包名称 == 导入路径最后名称（导入路径`math/rand` => 包`rand`）
-   大写标识符：`exported`（在其他包中可见）
-   小写标识符：`private`（在其他包中不可见）

## 控制结构

### If

```go
func main() {
	// 基本使用
	if x > 10 {
		return x
	} else if x == 10 {
		return 10
	} else {
		return -x
	}

	// 可以在条件之前加一个声明
	if a := b + c; a < 42 {
		return a
	} else {
		return a - 42
	}

	// 在其中使用断言
	var val interface{}
	val = "foo"
	if str, ok := val.(string); ok {
		fmt.Println(str)
	}
}
```

### Loops

只有`for`，没有`while`和`until`

```go
    for i := 1; i < 10; i++ {
    }
    for ; i < 10;  { // while - loop
    }
    for i < 10 { // 如果只有条件，可以省略分号
    }
    for { // 可以省略条件 ~ while (true)
    }

    //在当前循环中使用 break/continue
    //在外部循环中使用带标签的 break/continue
here:
    for i := 0; i < 2; i++ {
        for j := i + 1; j < 3; j++ {
            if i == 0 {
                continue here
            }
            fmt.Println(j)
            if j == 2 {
                break
            }
        }
    }

there:
    for i := 0; i < 2; i++ {
        for j := i + 1; j < 3; j++ {
            if j == 1 {
                continue
            }
            fmt.Println(j)
            if j == 2 {
                break there
            }
        }
    }
```

### Switch

```go
switch operatingSystem {
    case "darwin":
        fmt.Println("Mac OS Hipster")
        // 自动break，默认不会穿透
    case "linux":
        fmt.Println("Linux Geek")
    default:
        // Windows, BSD, ...
        fmt.Println("Other")
}
```

#### 与 for 和 if 一样，在 switch 值之前可以有一个赋值语句

```go
switch os := runtime.GOOS; os {
    case "darwin": ...
}
```

#### 可以使用对比

```go
number := 42
switch {
    case number < 42:
        fmt.Println("Smaller")
    case number == 42:
        fmt.Println("Equal")
    case number > 42:
        fmt.Println("Greater")
}
```

#### 多个 case 可用逗号分割

```go
var char byte = '?'
switch char {
    case ' ', '?', '&', '=', '#', '+', '%':
        fmt.Println("Should escape")
}
```

## 集合

### 数组

```go
var a [10]int // 声明长度为10的数组，长度是类型的一部分
a[3] = 42     // 设置
i := a[3]     // 读取

// 声明并初始化
var a = [2]int{1, 2}
a := [2]int{1, 2} // 简写
a := [...]int{1, 2} // 省略号 -> 编译器计算出数组长度
```

### 切片

```go
var a []int                      // 声明切片 - 和数组类似，但不指定长度
var a = []int {1, 2, 3, 4}       // 声明并初始化切片（由隐式给出的数组支持）
a := []int{1, 2, 3, 4}           // 简写
chars := []string{0:"a", 2:"c", 1: "b"}  // ["a", "b", "c"]

var b = a[lo:hi]	// 从数组创建切片，区间[lo, hi-1)
var b = a[1:4]		// 切片索引1到3
var b = a[:3]		// 开始索引默认为0
var b = a[3:]		// 结束索引默认len(a)
a =  append(a,17,3)	// 切片追加元素，实际对原数组进行对应操作
c := append(a,b...)	// 合并切片

// 通过 make 创建切片
a = make([]byte, 5, 5)	// 第一参数为长度，第二个为容量
a = make([]byte, 5)	// 容量为可选值

// 通过数组创建切片
x := [3]string{"Лайка", "Белка", "Стрелка"}
s := x[:] // 引用x存储的切片
```

#### 空间的重新分配

同源切片默认会共享内存，`append()`这个函数在 `cap` 不够用的时候就会重新分配内存以扩大容量，而**如果够用的时候不不会重新分享内存**！

`append()`内存不够会重新分配空间，但其他同源切片(或源数组)后续空间可能会被覆盖，需要 Full Slice Expression：

```go
var b = a[lo:hi:li]
```

其最后一个参数叫**Limited Capacity**，于是，后续的 `append()` 操作将会导致重新分配内存。

### 操作数组和切片

`len(a)` 返回数组/切片的长度，这是一个内置函数，而不是数组上的属性/方法。

```go
// 遍历
for i, e := range a {
    // i 是索引，e是元素
}

// 如果只需要e:
for _, e := range a {
}

// 如果只需要i:
for i := range a {
}

// 在Go 1.4之前的版本中，如果不使用i和e，编译器会报错。
// Go 1.4引入了无变量形式，因此可以执行此操作
for range time.Tick(time.Second) {
    // do it once a sec
}

```

### Maps

```go
var m map[string]int
m = make(map[string]int)
m["key"] = 42
fmt.Println(m["key"])

delete(m, "key")

elem, ok := m["key"] // 测试是否存在键"key"，如果有则返回

// map literal
var m = map[string]Vertex{
    "Bell Labs": {40.68433, -74.39967},
    "Google":    {37.42202, -122.08408},
}

// 遍历
for key, value := range m {
}

```

## 多态

### 接口

#### 接口声明

```go
type Awesomizer interface {
    Awesomize() string
}
```

#### 类型不声明实现接口

```go
type Foo struct {}
```

#### 如果类型实现所有必需的方法，则它们隐式满足接口

```go
func (foo Foo) Awesomize() string {
    return "Awesome!"
}
```

### 嵌入

Go 中没有`子类`。 而是有`接口`和`结构`嵌入。

```go
// ReadWriter 实现类必须满足 Reader 和 Writer
type ReadWriter interface {
    Reader
    Writer
}

// Server 暴露 Logger 的所有方法
type Server struct {
    Host string
    Port int
    *log.Logger
}

// 初始化嵌入类型的常用方式
server := &Server{"localhost", 80, log.New(...)}

// 通过嵌入式结构实现的方法
server.Log(...) // 调用 server.Logger.Log(...)

// 嵌入类型的字段名称是其类型名称（在本例中为Logger）
var logger *log.Logger = server.Logger
```

## 并发

### Goroutines

`Goroutines`是轻量级线程（由 Go 而不是 OS 管理）。 `go f(a, b)`启动一个新的 goroutine，该例程将运行`f`（`f`是一个函数）。

```go
// 只是一个函数（可以稍后作为goroutine启动）
func doStuff(s string) {
}

func main() {
    // 在goroutine中使用命名函数
    go doStuff("foobar")

    // 在goroutine中使用匿名内部函数
    go func (x int) {
        // function body goes here
    }(42)
}
```

### Channels

#### 非阻塞通道，发送和接收动作是同时发生的，如果没有接收者，发送会一直阻塞

```go
ch := make(chan int) // 创建一个类型为int的通道
ch <- 42             // 将值发送到通道ch
v := <-ch            // 接收来自ch的值
```

#### 缓冲通道，如果已写入小于<buffer size>的未读值，则写入不会阻塞。

```go
ch := make(chan int, 100)
```

#### 关闭通道（只有发送者应该关闭）

```go
close(ch)
```

#### 从通道读取并测试是否已关闭

```go
v, ok := <-ch

// 如果ok值为false，通道已被关闭
```

#### 读取通道直至关闭

```go
for i := range ch {
    fmt.Println(i)
}
```

#### 尝试多种通道操作，如果没有柱塞，则执行相应操作

```go
func doStuff(channelOut, channelIn chan int) {
    select {
        case channelOut <- 42:
            fmt.Println("We could write to channelOut!")
        case x := <- channelIn:
            fmt.Println("We could read from channelIn")
        case <-time.After(time.Second * 1):
            fmt.Println("timeout")
    }
}
```

### Channel Axioms

#### 发送到 nil 通道将永远阻塞

```go
var c chan string
c <- "Hello, World!"
// fatal error: all goroutines are asleep - deadlock!
```

#### 接收自 nil 通道将永远阻塞

```go
var c chan string
fmt.Println(<-c)
// fatal error: all goroutines are asleep - deadlock!
```

#### 发送到已关闭通道触发 panic

```go
var c = make(chan string, 1)
c <- "Hello, World!"
close(c)
c <- "Hello, Panic!"
// panic: send on closed channel
```

#### 来自关闭通道的接收立即返回零值

```go
var c = make(chan int, 2)
c <- 1
c <- 2
close(c)
for i := 0; i < 3; i++ {
    fmt.Printf("%d ", <-c)
}
// 1 2 0
```

## 杂项

### 错误

没有异常处理，可能会产生错误的函数只需声明类型为 Error 的附加返回值即可。 这是`Error`的接口：

```go
type error interface {
    Error() string
}
```

可能返回错误的方法:

```go
func doStuff() (int, error) {
}

func main() {
    result, err := doStuff()
    if err != nil {
        // handle error
    } else {
        // all is good, use result
    }
}
```

### 打印

```go
fmt.Println("Hello, 你好, नमस्ते, Привет, ᎣᏏᏲ") // 基本打印，结尾换行
p := struct { X, Y int }{ 17, 2 }
fmt.Println( "My point:", p, "x coord=", p.X ) // 打印 structs, ints, 等等
s := fmt.Sprintln( "My point:", p, "x coord=", p.X ) // 打印结果至string变量

fmt.Printf("%d hex:%x bin:%b fp:%f sci:%e",17,17,17,17.0,17.0) // 类c格式化
s2 := fmt.Sprintf( "%d %f", 17, 17.0 ) // 打印格式化结果至string变量

hellomsg := `
 "Hello" in Chinese is 你好 ('Ni Hao')
 "Hello" in Hindi is नमस्ते ('Namaste')
` // 多行字符串文字，在开头和结尾使用反引号
```

### 反射 - 类型 Switch

类型 switch 类似于常规 switch 语句，但是类型 switch 中的 case 指定类型（不是值），并将这些类型与给定接口的类型进行比较。

```go
func do(i interface{}) {
	switch v := i.(type) {
	case int:
		fmt.Printf("Twice %v is %v\n", v, v*2)
	case string:
		fmt.Printf("%q is %v bytes long\n", v, len(v))
	default:
		fmt.Printf("I don't know about type %T!\n", v)
	}
}

func main() {
	do(21)
	do("hello")
	do(true)
}
```

### HTTP Server

```go
package main

import (
    "fmt"
    "net/http"
)

// 定义response类型
type Hello struct{}

// 让该类型实现ServeHTTP方法（在接口http.Handler中定义）
func (h Hello) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello!")
}

func main() {
    var h Hello
    http.ListenAndServe("localhost:4000", h)
}

// http.ServeHTTP 接口签名:
// type Handler interface {
//     ServeHTTP(w http.ResponseWriter, r *http.Request)
// }
```

## 编程模式

### 深度比较

比较两个结构体中的数据是否相同时，需要使用深度比较，而不是只是简单地做浅度比较。这里需要使用到反射 `reflect.DeepEqual()`：

```go
import (
    "fmt"
    "reflect"
)

func main() {

    v1 := data{}
    v2 := data{}
    fmt.Println("v1 == v2:",reflect.DeepEqual(v1,v2))
    //prints: v1 == v2: true

    m1 := map[string]string{"one": "a","two": "b"}
    m2 := map[string]string{"two": "b", "one": "a"}
    fmt.Println("m1 == m2:",reflect.DeepEqual(m1, m2))
    //prints: m1 == m2: true

    s1 := []int{1, 2, 3}
    s2 := []int{1, 2, 3}
    fmt.Println("s1 == s2:",reflect.DeepEqual(s1, s2))
    //prints: s1 == s2: true
}
```

### 接口编程

```go
type Country struct {
    Name string
}

type City struct {
    Name string
}

type Stringable interface {
    ToString() string
}
func (c Country) ToString() string {
    return "Country = " + c.Name
}
func (c City) ToString() string{
    return "City = " + c.Name
}

func PrintStr(p Stringable) {
    fmt.Println(p.ToString())
}

d1 := Country {"USA"}
d2 := City{"Los Angeles"}
PrintStr(d1)
PrintStr(d2)
```

### 接口完整性检查

```go
type Shape interface {
    Sides() int
    Area() int
}
type Square struct {
    len int
}
func (s* Square) Sides() int {
    return 4
}
func main() {
    s := Square{len: 5}
    fmt.Printf("%d\n",s.Sides())
}
```

`Square` 并没有实现 `Shape` 接口的所有方法，程序虽然可以跑通，但是这样编程的方式并不严谨。如果我们需要强制实现接口的所有方法，在 Go 语言编程圈里有一个比较标准的作法：

```go
var _ Shape = (*Square)(nil)
```

声明一个 `_` 变量（没人用），其会把一个 `nil` 的空指针，从 `Square` 转成 `Shape`，这样，如果没有实现完相关的接口方法，编译器就会报错。

### 时间

在 Go 语言中，你一定要使用 `time.Time` 和 `time.Duration` 两个类型：

-   在命令行上，`flag` 通过 `time.ParseDuration` 支持了 `time.Duration`
-   `JSon` 中的 `encoding/json` 中也可以把`time.Time` 编码成 [RFC 3339](https://tools.ietf.org/html/rfc3339) 的格式
-   数据库使用的 `database/sql` 也支持把 `DATATIME` 或 `TIMESTAMP` 类型转成 `time.Time`
-   `YAML`你可以使用 `gopkg.in/yaml.v2` 也支持 `time.Time` 、`time.Duration` 和 [RFC 3339](https://tools.ietf.org/html/rfc3339) 格式

### 性能提示

-   数字转字符串，使用 `strconv.Itoa()` 会比 `fmt.Sprintf()` 要快一倍左右
-   尽可能地避免把`String`转成`[]Byte`
-   如果在`for-loop`里对某个`slice` 使用 `append()`请先把 `slice`的容量很扩充到位，这样可以避免内存重新分享以及系统自动按 2 的 N 次方幂进行扩展但又用不到，从而浪费内存。
-   使用`StringBuffer` 或是`StringBuild` 来拼接字符串
-   尽可能的使用并发的 `go routine`，然后使用 `sync.WaitGroup` 来同步分片操作
-   避免在热代码中进行内存分配，这样会导致`gc`很忙。尽可能的使用 `sync.Pool` 来重用对象
-   使用 `lock-free`的操作，避免使用 `mutex`，尽可能使用 `sync/Atomic`包
-   使用 `I/O`缓冲，`I/O`是个非常非常慢的操作，使用 `bufio.NewWrite()` 和 `bufio.NewReader()` 可以带来更高的性能
-   `for-loop`里的固定的正则表达式，一定要使用 `regexp.Compile()` 编译正则表达式

## 错误处理

Go 语言的函数支持多返回值，所以，可以在返回接口把业务语义（业务返回值）和控制语义（出错返回值）区分开来。Go 语言的很多函数都会返回 result, err 两个值，于是:

-   参数上基本上就是入参，而返回接口把结果和错误分离，这样使得函数的接口语义清晰；
-   而且，Go 语言中的错误参数如果要忽略，需要显式地忽略，用 `_` 这样的变量来忽略；
-   另外，因为返回的 `error` 是个接口（其中只有一个方法 `Error()`，返回一个 `string` ），所以你可以扩展自定义的错误处理。

### 多个不同类型的 error：

```go
if err != nil {
  switch err.(type) {
    case *json.SyntaxError:
      ...
    case *ZeroDivisionError:
      ...
    case *NullPointerError:
      ...
    default:
      ...
  }
}
```

### `defer` 关键词进行资源清理

```go
func Close(c io.Closer) {
  err := c.Close()
  if err != nil {
    log.Fatal(err)
  }
}

func main() {
  r, err := Open("a")
  if err != nil {
    log.Fatalf("error opening 'a'\n")
  }
  defer Close(r) // 使用defer关键字在函数退出时关闭文件。

  r, err = Open("b")
  if err != nil {
    log.Fatalf("error opening 'b'\n")
  }
  defer Close(r) // 使用defer关键字在函数退出时关闭文件。
}
```

### 优雅的错误检查

```go
type Reader struct {
    r   io.Reader
    err error
}
func (r *Reader) read(data interface{}) {
    if r.err == nil {
        r.err = binary.Read(r.r, binary.BigEndian, data)
    }
}

func parse(input io.Reader) (*Point, error) {
    var p Point
    r := Reader{r: input}

    r.read(&p.Longitude)
    r.read(&p.Latitude)
    r.read(&p.Distance)
    r.read(&p.ElevationGain)
    r.read(&p.ElevationLoss)

    if r.err != nil {
        return nil, r.err
    }

    return &p, nil
}
```

#### 流式接口 Fluent Interface

```go
package main

import (
  "bytes"
  "encoding/binary"
  "fmt"
)

// 长度不够，少一个Weight
var b = []byte {0x48, 0x61, 0x6f, 0x20, 0x43, 0x68, 0x65, 0x6e, 0x00, 0x00, 0x2c}
var r = bytes.NewReader(b)

type Person struct {
  Name [10]byte
  Age uint8
  Weight uint8
  err error
}
func (p *Person) read(data interface{}) {
  if p.err == nil {
    p.err = binary.Read(r, binary.BigEndian, data)
  }
}

func (p *Person) ReadName() *Person {
  p.read(&p.Name)
  return p
}
func (p *Person) ReadAge() *Person {
  p.read(&p.Age)
  return p
}
func (p *Person) ReadWeight() *Person {
  p.read(&p.Weight)
  return p
}
func (p *Person) Print() *Person {
  if p.err == nil {
    fmt.Printf("Name=%s, Age=%d, Weight=%d\n",p.Name, p.Age, p.Weight)
  }
  return p
}

func main() {
  p := Person{}
  p.ReadName().ReadAge().ReadWeight().Print()
  fmt.Println(p.err)  // EOF 错误
}
```

### 包装错误

```go
if err != nil {
   return fmt.Errorf("something failed: %v", err)
}
```

```go
type authorizationError struct {
    operation string
    err error   // original error
}
func (e *authorizationError) Error() string {
    return fmt.Sprintf("authorization failed during %s: %v", e.operation, e.err)
}
```

#### 使用 causer 接口中实现 Cause() 方法来暴露原始错误

```go
type causer interface {
    Cause() error
}

func (e *authorizationError) Cause() error {
    return e.err
}
```

#### 第三方的错误库（github.com/pkg/errors）

```go
import "github.com/pkg/errors"

//错误包装
if err != nil {
    return errors.Wrap(err, "read failed")
}

// Cause接口
switch err := errors.Cause(err).(type) {
case *MyError:
    // handle specifically
default:
    // unknown error
}
```

## 函数式编程

Go 语言不支持重载函数，所以，需要使用不同的函数名来应对不同入参需求

### Builder 模式

```go
//使用一个builder类来做包装
type ServerBuilder struct {
  Server
}

func (sb *ServerBuilder) Create(addr string, port int) *ServerBuilder {
  sb.Server.Addr = addr
  sb.Server.Port = port
  //其它代码设置其它成员的默认值
  return sb
}

func (sb *ServerBuilder) WithProtocol(protocol string) *ServerBuilder {
  sb.Server.Protocol = protocol
  return sb
}

// ...

func (sb *ServerBuilder) Build() (Server) {
  return  sb.Server
}
```

```go
sb := ServerBuilder{}
server, err := sb.Create("127.0.0.1", 8080).
  WithProtocol("udp").
  Build()
```

### Functional Options

先定义一个函数类型：

```go
type Option func(*Server)
```

使用函数式的方式定义一组如下的函数：

```go
func Protocol(p string) Option {
    return func(s *Server) {
        s.Protocol = p
    }
}
func Timeout(timeout time.Duration) Option {
    return func(s *Server) {
        s.Timeout = timeout
    }
}
func MaxConns(maxconns int) Option {
    return func(s *Server) {
        s.MaxConns = maxconns
    }
}
func TLS(tls *tls.Config) Option {
    return func(s *Server) {
        s.TLS = tls
    }
}
```

-   当我们调用其中的一个函数用 `MaxConns(30)` 时
-   其返回值是一个 `func(s* Server) { s.MaxConns = 30 }` 的函数。

使用：

```go
func NewServer(addr string, port int, options ...func(*Server)) (*Server, error) {

  srv := Server{
    Addr:     addr,
    Port:     port,
    Protocol: "tcp",
    Timeout:  30 * time.Second,
    MaxConns: 1000,
    TLS:      nil,
  }
  for _, option := range options {
    option(&srv)
  }
  //...
  return &srv, nil
}
```

```go
s1, _ := NewServer("localhost", 1024)
s2, _ := NewServer("localhost", 2048, Protocol("udp"))
s3, _ := NewServer("0.0.0.0", 8080, Timeout(300*time.Second), MaxConns(1000))
```

## 委托和反转控制

### 委托

Go 语言可以把一个结构体嵌入另一个结构体

```go
type Widget struct {
    X, Y int
}
type Label struct {
    Widget        // Embedding (delegation)
    Text   string // Aggregation
}

// 使用
label := Label{Widget{10, 10}, "State:"}
label.X = 11
label.Y = 12
```

如果在 `Label` 结构体里出现了重名，就需要解决重名，例如，如果 成员 `X` 重名，用 `label.X`表明 是自己的`X` ，用 `label.Wedget.X` 表示嵌入过来的。

### 翻转控制

```go
type Undo []func()
```

```go
func (undo *Undo) Add(function func()) {
  *undo = append(*undo, function)
}

func (undo *Undo) Undo() error {
  functions := *undo
  if len(functions) == 0 {
    return errors.New("No functions to undo")
  }
  index := len(functions) - 1
  if function := functions[index]; function != nil {
    function()
    functions[index] = nil // For garbage collection
  }
  *undo = functions[:index]
  return nil
}
```

```go
type IntSet struct {
    data map[int]bool
    undo Undo
}

func NewIntSet() IntSet {
    return IntSet{data: make(map[int]bool)}
}

func (set *IntSet) Undo() error {
    return set.undo.Undo()
}

func (set *IntSet) Contains(x int) bool {
    return set.data[x]
}

func (set *IntSet) Add(x int) {
    if !set.Contains(x) {
        set.data[x] = true
        set.undo.Add(func() { set.Delete(x) })
    } else {
        set.undo.Add(nil)
    }
}

func (set *IntSet) Delete(x int) {
    if set.Contains(x) {
        delete(set.data, x)
        set.undo.Add(func() { set.Add(x) })
    } else {
        set.undo.Add(nil)
    }
}
```

不再由 控制逻辑 `Undo` 来依赖业务逻辑 `IntSet`，而是由业务逻辑 `IntSet` 来依赖 `Undo` 。其依赖的是其实是一个协议，这个协议是一个没有参数的函数数组。我们也可以看到，我们 `Undo` 的代码就可以复用了。

## MAP-REDUCE

### Map

```go
func MapStrToStr(arr []string, fn func(s string) string) []string {
    var newArray = []string{}
    for _, it := range arr {
        newArray = append(newArray, fn(it))
    }
    return newArray
}
func MapStrToInt(arr []string, fn func(s string) int) []int {
    var newArray = []int{}
    for _, it := range arr {
        newArray = append(newArray, fn(it))
    }
    return newArray
}
```

```go
var list = []string{"Hao", "Chen", "MegaEase"}

x := MapStrToStr(list, func(s string) string {
    return strings.ToUpper(s)
})
fmt.Printf("%v\n", x)
//["HAO", "CHEN", "MEGAEASE"]

y := MapStrToInt(list, func(s string) int {
    return len(s)
})
fmt.Printf("%v\n", y)
//[3, 4, 8]
```

### Reduce

```go
func Reduce(arr []string, fn func(s string) int) int {
    sum := 0
    for _, it := range arr {
        sum += fn(it)
    }
    return sum
}

var list = []string{"Hao", "Chen", "MegaEase"}

x := Reduce(list, func(s string) int {
    return len(s)
})
fmt.Printf("%v\n", x)
// 15
```

### Filter

```go
func Filter(arr []int, fn func(n int) bool) []int {
    var newArray = []int{}
    for _, it := range arr {
        if fn(it) {
            newArray = append(newArray, it)
        }
    }
    return newArray
}

var intset = []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
out := Filter(intset, func(n int) bool {
   return n%2 == 1
})
fmt.Printf("%v\n", out)

out = Filter(intset, func(n int) bool {
    return n > 5
})
fmt.Printf("%v\n", out)
```

### Map-Reduce 与 泛型

`Map/Reduce/Filter`只是一种控制逻辑，真正的业务逻辑是在传给他们的数据和那个函数来定义的。是的，这是一个很经典的**业务逻辑**和**控制逻辑**分离解耦的编程模式。

```
Go开发团队技术负责人Russ Cox在2012年11月21golang-dev上的mail确认了Go泛型(type parameter)将在Go 1.18版本落地，即2022.2月份
```

### 简单版 Generic Map

目前的`Go`语言的泛型只能用 `interface{} + reflect`来完成，`interface{}` 可以理解为`C`中的 `void*`，`Java`中的 `Object` ，`reflect`是`Go`的反射机制包，用于在运行时检查类型。

```go
func Map(data interface{}, fn interface{}) []interface{} {
    vfn := reflect.ValueOf(fn)
    vdata := reflect.ValueOf(data)
    result := make([]interface{}, vdata.Len())

    for i := 0; i < vdata.Len(); i++ {
        result[i] = vfn.Call([]reflect.Value{vdata.Index(i)})[0].Interface()
    }
    return result
}
```

-   通过 reflect.ValueOf() 来获得 interface{} 的值，其中一个是数据 vdata，另一个是函数 vfn，
-   然后通过 vfn.Call() 方法来调用函数，通过 []refelct.Value{vdata.Index(i)}来获得数据。

### 健壮版的 Generic Map

要写一个健壮的程序，对于这种用`interface{}` 的“过度泛型”，就需要我们自己来做类型检查。

```go
func Transform(slice, function interface{}) interface{} {
  return transform(slice, function, false)
}

func TransformInPlace(slice, function interface{}) interface{} {
  return transform(slice, function, true)
}

func transform(slice, function interface{}, inPlace bool) interface{} {

  //check the <code data-enlighter-language="raw" class="EnlighterJSRAW">slice</code> type is Slice
  sliceInType := reflect.ValueOf(slice)
  if sliceInType.Kind() != reflect.Slice {
    panic("transform: not slice")
  }

  //check the function signature
  fn := reflect.ValueOf(function)
  elemType := sliceInType.Type().Elem()
  if !verifyFuncSignature(fn, elemType, nil) {
    panic("trasform: function must be of type func(" + sliceInType.Type().Elem().String() + ") outputElemType")
  }

  sliceOutType := sliceInType
  if !inPlace {
    sliceOutType = reflect.MakeSlice(reflect.SliceOf(fn.Type().Out(0)), sliceInType.Len(), sliceInType.Len())
  }
  for i := 0; i < sliceInType.Len(); i++ {
    sliceOutType.Index(i).Set(fn.Call([]reflect.Value{sliceInType.Index(i)})[0])
  }
  return sliceOutType.Interface()

}

func verifyFuncSignature(fn reflect.Value, types ...reflect.Type) bool {

  //Check it is a funciton
  if fn.Kind() != reflect.Func {
    return false
  }
  // NumIn() - returns a function type's input parameter count.
  // NumOut() - returns a function type's output parameter count.
  if (fn.Type().NumIn() != len(types)-1) || (fn.Type().NumOut() != 1) {
    return false
  }
  // In() - returns the type of a function type's i'th input parameter.
  for i := 0; i < len(types)-1; i++ {
    if fn.Type().In(i) != types[i] {
      return false
    }
  }
  // Out() - returns the type of a function type's i'th output parameter.
  outType := types[len(types)-1]
  if outType != nil && fn.Type().Out(0) != outType {
    return false
  }
  return true
}
```

-   代码中没有使用`Map`函数，因为和数据结构和关键有含义冲突的问题，所以使用`Transform`，这个来源于 `C++ STL`库中的命名。
-   有两个版本的函数，一个是返回一个全新的数组 – `Transform()`，一个是“就地完成” – `TransformInPlace()`
-   在主函数中，用 `Kind()` 方法检查了数据类型是不是 `Slice`，函数类型是不是`Func`
-   检查函数的参数和返回类型是通过 `verifyFuncSignature()` 来完成的，其中：
-   `NumIn()` – 用来检查函数的“入参”
-   `NumOut()` 用来检查函数的“返回值”
-   如果需要新生成一个`Slice`，会使用 `reflect.MakeSlice()` 来完成。

```go
list := []string{"1", "2", "3", "4", "5", "6"}
result := Transform(list, func(a string) string{
    return a +a +a
})
//{"111","222","333","444","555","666"}
```

### 健壮版的 Generic Reduce

```go
func Reduce(slice, pairFunc, zero interface{}) interface{} {
  sliceInType := reflect.ValueOf(slice)
  if sliceInType.Kind() != reflect.Slice {
    panic("reduce: wrong type, not slice")
  }

  len := sliceInType.Len()
  if len == 0 {
    return zero
  } else if len == 1 {
    return sliceInType.Index(0)
  }

  elemType := sliceInType.Type().Elem()
  fn := reflect.ValueOf(pairFunc)
  if !verifyFuncSignature(fn, elemType, elemType, elemType) {
    t := elemType.String()
    panic("reduce: function must be of type func(" + t + ", " + t + ") " + t)
  }

  var ins [2]reflect.Value
  ins[0] = sliceInType.Index(0)
  ins[1] = sliceInType.Index(1)
  out := fn.Call(ins[:])[0]

  for i := 2; i < len; i++ {
    ins[0] = out
    ins[1] = sliceInType.Index(i)
    out = fn.Call(ins[:])[0]
  }
  return out.Interface()
}
```

### 健壮版的 Generic Filter

```go
func Filter(slice, function interface{}) interface{} {
  result, _ := filter(slice, function, false)
  return result
}

func FilterInPlace(slicePtr, function interface{}) {
  in := reflect.ValueOf(slicePtr)
  if in.Kind() != reflect.Ptr {
    panic("FilterInPlace: wrong type, " +
      "not a pointer to slice")
  }
  _, n := filter(in.Elem().Interface(), function, true)
  in.Elem().SetLen(n)
}

var boolType = reflect.ValueOf(true).Type()

func filter(slice, function interface{}, inPlace bool) (interface{}, int) {

  sliceInType := reflect.ValueOf(slice)
  if sliceInType.Kind() != reflect.Slice {
    panic("filter: wrong type, not a slice")
  }

  fn := reflect.ValueOf(function)
  elemType := sliceInType.Type().Elem()
  if !verifyFuncSignature(fn, elemType, boolType) {
    panic("filter: function must be of type func(" + elemType.String() + ") bool")
  }

  var which []int
  for i := 0; i < sliceInType.Len(); i++ {
    if fn.Call([]reflect.Value{sliceInType.Index(i)})[0].Bool() {
      which = append(which, i)
    }
  }

  out := sliceInType

  if !inPlace {
    out = reflect.MakeSlice(sliceInType.Type(), len(which), len(which))
  }
  for i := range which {
    out.Index(i).Set(sliceInType.Index(which[i]))
  }

  return out.Interface(), len(which)
}
```

## GO GENERATION

### 类型检查

因为`Go`语言目前并不支持真正的泛型，所以，只能用 `interface{}` 这样的类似于 `void*` 这种过度泛型来玩这就导致了我们在实际过程中就需要进行类型检查。`Go`语言的类型检查有两种技术，一种是 `Type Assert`，一种是`Reflection`。

#### Type Assert

对某个变量进行 `.(type)`的转型操作，其会返回两个值， `variable, error`，第一个返回值是被转换好的类型，第二个是如果不能转换类型，则会报错。

```go
//Container is a generic container, accepting anything.
type Container []interface{}

//Put adds an element to the container.
func (c *Container) Put(elem interface{}) {
    *c = append(*c, elem)
}
//Get gets an element from the container.
func (c *Container) Get() interface{} {
    elem := (*c)[0]
    *c = (*c)[1:]
    return elem
}
```

```go
intContainer := &Container{}
intContainer.Put(7)
intContainer.Put(42)
```

但是，在把数据取出来时，因为类型是 `interface{}` ，所以，你还要做一个转型，如果转型成功能才能进行后续操作

```go
// assert that the actual type is int
elem, ok := intContainer.Get().(int)
if !ok {
    fmt.Println("Unable to read an int from intContainer")
}

fmt.Printf("assertExample: %d (%T)\n", elem, elem)
```

#### Reflection

```go
type Container struct {
    s reflect.Value
}
func NewContainer(t reflect.Type, size int) *Container {
    if size <=0  { size=64 }
    return &Container{
        s: reflect.MakeSlice(reflect.SliceOf(t), 0, size),
    }
}
func (c *Container) Put(val interface{})  error {
    if reflect.ValueOf(val).Type() != c.s.Type().Elem() {
        return fmt.Errorf("Put: cannot put a %T into a slice of %s",
            val, c.s.Type().Elem()))
    }
    c.s = reflect.Append(c.s, reflect.ValueOf(val))
    return nil
}
func (c *Container) Get(refval interface{}) error {
    if reflect.ValueOf(refval).Kind() != reflect.Ptr ||
        reflect.ValueOf(refval).Elem().Type() != c.s.Type().Elem() {
        return fmt.Errorf("Get: needs *%s but got %T", c.s.Type().Elem(), refval)
    }
    reflect.ValueOf(refval).Elem().Set( c.s.Index(0) )
    c.s = c.s.Slice(1, c.s.Len())
    return nil
}
```

-   在 `NewContainer()`会根据参数的类型初始化一个`Slice`
-   在 `Put()`时候，会检查 `val` 是否和`Slice`的类型一致。
-   在 `Get()`时，我们需要用一个入参的方式，因为我们没有办法返回 `reflect.Value` 或是 `interface{}`，不然还要做`Type Assert`
-   但是有类型检查，所以，必然会有检查不对的道理 ，因此，需要返回 `error`

```go
f1 := 3.1415926
f2 := 1.41421356237

c := NewMyContainer(reflect.TypeOf(f1), 16)

if err := c.Put(f1); err != nil {
  panic(err)
}
if err := c.Put(f2); err != nil {
  panic(err)
}

g := 0.0

if err := c.Get(&g); err != nil {
  panic(err)
}
fmt.Printf("%v (%T)\n", g, g) //3.1415926 (float64)
fmt.Println(c.s.Index(0)) //1.4142135623
```

`Type Assert`是不用了，但是用反射写出来的代码还是有点复杂的。

### Go Generator

#### C++ Template

对于泛型编程最牛的语言 `C++` 来说，这类的问题都是使用 `Template`来解决的。

```go
//用<class T>来描述泛型
template <class T>
T GetMax (T a, T b)  {
    T result;
    result = (a>b)? a : b;
    return (result);
}
```

```go
int i=5, j=6, k;
//生成int类型的函数
k=GetMax<int>(i,j);

long l=10, m=5, n;
//生成long类型的函数
n=GetMax<long>(l,m);
```

`C++`的编译器会在编译时分析代码，根据不同的变量类型来自动化的生成相关类型的函数或类。`C++`叫模板的具体化。

这个技术是编译时的问题，所以，不需要我们在运行时进行任何的运行的类型识别，我们的程序也会变得比较的干净。Go 的编译器不帮你干，你需要自己动手。

要玩 Go 的代码生成，你需要三件事：

-   一个函数模板，其中设置好相应的占位符。
-   一个脚本，用于按规则来替换文本并生成新的代码。
-   一行注释代码。

#### 函数模板

我们把我们之前的示例改成模板。取名为 `container.tmp.go` 放在 `./template/`下

```go
package PACKAGE_NAME
type GENERIC_NAMEContainer struct {
    s []GENERIC_TYPE
}
func NewGENERIC_NAMEContainer() *GENERIC_NAMEContainer {
    return &GENERIC_NAMEContainer{s: []GENERIC_TYPE{}}
}
func (c *GENERIC_NAMEContainer) Put(val GENERIC_TYPE) {
    c.s = append(c.s, val)
}
func (c *GENERIC_NAMEContainer) Get() GENERIC_TYPE {
    r := c.s[0]
    c.s = c.s[1:]
    return r
}
```

我们可以看到函数模板中我们有如下的占位符：

-   `PACKAGE_NAME` – 包名
-   `GENERIC_NAME` – 名字
-   `GENERIC_TYPE` – 实际的类型

#### 函数生成脚本

然后，我们有一个叫`gen.sh`的生成脚本，如下所示：

```shell
#!/bin/bash

set -e

SRC_FILE=${1}
PACKAGE=${2}
TYPE=${3}
DES=${4}
#uppcase the first char
PREFIX="$(tr '[:lower:]' '[:upper:]' <<< ${TYPE:0:1})${TYPE:1}"

DES_FILE=$(echo ${TYPE}| tr '[:upper:]' '[:lower:]')_${DES}.go

sed 's/PACKAGE_NAME/'"${PACKAGE}"'/g' ${SRC_FILE} | \
    sed 's/GENERIC_TYPE/'"${TYPE}"'/g' | \
    sed 's/GENERIC_NAME/'"${PREFIX}"'/g' > ${DES_FILE}
```

其需要 4 个参数：

-   模板源文件
-   包名
-   实际需要具体化的类型
-   用于构造目标文件名的后缀

#### 生成代码

接下来，我们只需要在代码中打一个特殊的注释：

```go
//go:generate ./gen.sh ./template/container.tmp.go gen uint32 container
func generateUint32Example() {
    var u uint32 = 42
    c := NewUint32Container()
    c.Put(u)
    v := c.Get()
    fmt.Printf("generateExample: %d (%T)\n", v, v)
}

//go:generate ./gen.sh ./template/container.tmp.go gen string container
func generateStringExample() {
    var s string = "Hello"
    c := NewStringContainer()
    c.Put(s)
    v := c.Get()
    fmt.Printf("generateExample: %s (%T)\n", v, v)
}
```

-   第一个注释是生成包名为 `gen` 类型为 `uint32` 目标文件名以 `container` 为后缀
-   第二个注释是生成包名为 `gen` 类型为 `string` 目标文件名以 `container` 为后缀

然后，在工程目录中直接执行 `go generate` 命令，就会生成两份代码。

一份文件名为`uint32_container.go`:

```go
package gen

type Uint32Container struct {
    s []uint32
}
func NewUint32Container() *Uint32Container {
    return &Uint32Container{s: []uint32{}}
}
func (c *Uint32Container) Put(val uint32) {
    c.s = append(c.s, val)
}
func (c *Uint32Container) Get() uint32 {
    r := c.s[0]
    c.s = c.s[1:]
    return r
}
```

### 新版 Filter

`Fitler`的模板文件 `filter.tmp.go`

```go
package PACKAGE_NAME

type GENERIC_NAMEList []GENERIC_TYPE

type GENERIC_NAMEToBool func(*GENERIC_TYPE) bool

func (al GENERIC_NAMEList) Filter(f GENERIC_NAMEToBool) GENERIC_NAMEList {
    var ret GENERIC_NAMEList
    for _, a := range al {
        if f(&a) {
            ret = append(ret, a)
        }
    }
    return ret
}
```

于是我们可在需要使用这个的地方，加上相关的 `go generate` 的注释

```go
type Employee struct {
  Name     string
  Age      int
  Vacation int
  Salary   int
}

//go:generate ./gen.sh ./template/filter.tmp.go gen Employee filter
func filterEmployeeExample() {

  var list = EmployeeList{
    {"Hao", 44, 0, 8000},
    {"Bob", 34, 10, 5000},
    {"Alice", 23, 5, 9000},
    {"Jack", 26, 0, 4000},
    {"Tom", 48, 9, 7500},
  }

  var filter EmployeeList
  filter = list.Filter(func(e *Employee) bool {
    return e.Age > 40
  })

  fmt.Println("----- Employee.Age > 40 ------")
  for _, e := range filter {
    fmt.Println(e)
  }

  filter = list.Filter(func(e *Employee) bool {
    return e.Salary <= 5000
  })

  fmt.Println("----- Employee.Salary <= 5000 ------")
  for _, e := range filter {
    fmt.Println(e)
  }
}
```

### 第三方工具

我们并不需要自己手写 `gen.sh` 这样的工具类，已经有很多第三方的已经写好的可以使用。下面是一个列表：

-   Genny – [https://github.com/cheekybits/genny](https://github.com/cheekybits/genny)
-   Generic – [https://github.com/taylorchu/generic](https://github.com/taylorchu/generic)
-   GenGen – [https://github.com/joeshaw/gengen](https://github.com/taylorchu/generic)
-   Gen – [https://github.com/clipperhouse/gen](https://github.com/clipperhouse/gen)

## 修饰器

### 简单示例

```go
package main

import "fmt"

func decorator(f func(s string)) func(s string) {

    return func(s string) {
        fmt.Println("Started")
        f(s)
        fmt.Println("Done")
    }
}

func Hello(s string) {
    fmt.Println(s)
}

func main() {
        decorator(Hello)("Hello, World!")
}
```

如果你要想让代码容易读一些，你可以这样：

```go
hello := decorator(Hello)
hello("Hello")
```

我们再来看一个和计算运行时间的例子：

```go
package main

import (
  "fmt"
  "reflect"
  "runtime"
  "time"
)

type SumFunc func(int64, int64) int64

func getFunctionName(i interface{}) string {
  return runtime.FuncForPC(reflect.ValueOf(i).Pointer()).Name()
}

func timedSumFunc(f SumFunc) SumFunc {
  return func(start, end int64) int64 {

    defer func(t time.Time) {
      fmt.Printf("--- Time Elapsed (%s): %v ---\n",
          getFunctionName(f), time.Since(t))
    }(time.Now())

    return f(start, end)
  }
}

func Sum1(start, end int64) int64 {
  var sum int64
  sum = 0
  if start > end {
    start, end = end, start
  }
  for i := start; i <= end; i++ {
    sum += i
  }
  return sum
}

func Sum2(start, end int64) int64 {
  if start > end {
    start, end = end, start
  }
  return (end - start + 1) * (end + start) / 2
}

func main() {

  sum1 := timedSumFunc(Sum1)
  sum2 := timedSumFunc(Sum2)

  fmt.Printf("%d, %d\n", sum1(-10000, 10000000), sum2(-10000, 10000000))
}
```

-   `1`）有两个 `Sum` 函数，`Sum1()` 函数就是简单的做个循环，`Sum2()` 函数动用了数据公式。（注意：`start` 和 `end` 有可能有负数的情况）
-   `2`）代码中使用了 `Go` 语言的反射机器来获取函数名。
-   `3`）修饰器函数是 `timedSumFunc()`

### HTTP 相关的一个示例

```go
package main

import (
    "fmt"
    "log"
    "net/http"
    "strings"
)

func WithServerHeader(h http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        log.Println("--->WithServerHeader()")
        w.Header().Set("Server", "HelloServer v0.0.1")
        h(w, r)
    }
}

func hello(w http.ResponseWriter, r *http.Request) {
    log.Printf("Recieved Request %s from %s\n", r.URL.Path, r.RemoteAddr)
    fmt.Fprintf(w, "Hello, World! "+r.URL.Path)
}

func main() {
    http.HandleFunc("/v1/hello", WithServerHeader(hello))
    err := http.ListenAndServe(":8080", nil)
    if err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}
```

于是，这样的函数我们可以写出好些个。如下所示，有写 HTTP 响应头的，有写认证 Cookie 的，有检查认证 Cookie 的，有打日志的……

```go
package main

import (
    "fmt"
    "log"
    "net/http"
    "strings"
)

func WithServerHeader(h http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        log.Println("--->WithServerHeader()")
        w.Header().Set("Server", "HelloServer v0.0.1")
        h(w, r)
    }
}

func WithAuthCookie(h http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        log.Println("--->WithAuthCookie()")
        cookie := &http.Cookie{Name: "Auth", Value: "Pass", Path: "/"}
        http.SetCookie(w, cookie)
        h(w, r)
    }
}

func WithBasicAuth(h http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        log.Println("--->WithBasicAuth()")
        cookie, err := r.Cookie("Auth")
        if err != nil || cookie.Value != "Pass" {
            w.WriteHeader(http.StatusForbidden)
            return
        }
        h(w, r)
    }
}

func WithDebugLog(h http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        log.Println("--->WithDebugLog")
        r.ParseForm()
        log.Println(r.Form)
        log.Println("path", r.URL.Path)
        log.Println("scheme", r.URL.Scheme)
        log.Println(r.Form["url_long"])
        for k, v := range r.Form {
            log.Println("key:", k)
            log.Println("val:", strings.Join(v, ""))
        }
        h(w, r)
    }
}
func hello(w http.ResponseWriter, r *http.Request) {
    log.Printf("Recieved Request %s from %s\n", r.URL.Path, r.RemoteAddr)
    fmt.Fprintf(w, "Hello, World! "+r.URL.Path)
}

func main() {
    http.HandleFunc("/v1/hello", WithServerHeader(WithAuthCookie(hello)))
    http.HandleFunc("/v2/hello", WithServerHeader(WithBasicAuth(hello)))
    http.HandleFunc("/v3/hello", WithServerHeader(WithBasicAuth(WithDebugLog(hello))))
    err := http.ListenAndServe(":8080", nil)
    if err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}
```

### 多个修饰器的 Pipeline

需要先写一个工具函数——用来遍历并调用各个 decorator：

```go
type HttpHandlerDecorator func(http.HandlerFunc) http.HandlerFunc

func Handler(h http.HandlerFunc, decors ...HttpHandlerDecorator) http.HandlerFunc {
    for i := range decors {
        d := decors[len(decors)-1-i] // iterate in reverse
        h = d(h)
    }
    return h
}
```

```go
http.HandleFunc("/v4/hello", Handler(hello,
                WithServerHeader, WithBasicAuth, WithDebugLog))
```

### 泛型的修饰器

下面是我用 reflection 机制写的一个比较通用的修饰器（为了便于阅读，我删除了出错判断代码）

```go
func Decorator(decoPtr, fn interface{}) (err error) {
    var decoratedFunc, targetFunc reflect.Value

    decoratedFunc = reflect.ValueOf(decoPtr).Elem()
    targetFunc = reflect.ValueOf(fn)

    v := reflect.MakeFunc(targetFunc.Type(),
            func(in []reflect.Value) (out []reflect.Value) {
                fmt.Println("before")
                out = targetFunc.Call(in)
                fmt.Println("after")
                return
            })

    decoratedFunc.Set(v)
    return
}
```

上面的代码动用了 `reflect.MakeFunc()` 函数制出了一个新的函数其中的 `targetFunc.Call(in)` 调用了被修饰的函数。

上面这个 `Decorator()` 需要两个参数，

-   第一个是出参 `decoPtr` ，就是完成修饰后的函数
-   第二个是入参 `fn` ，就是需要修饰的函数

首先假设我们有两个需要修饰的函数：

```go
func foo(a, b, c int) int {
    fmt.Printf("%d, %d, %d \n", a, b, c)
    return a + b + c
}

func bar(a, b string) string {
    fmt.Printf("%s, %s \n", a, b)
    return a + b
}
```

然后，我们可以这样做：

```go
type MyFoo func(int, int, int) int
var myfoo MyFoo
Decorator(&myfoo, foo)
myfoo(1, 2, 3)
```

你会发现，使用 `Decorator()` 时，还需要先声明一个函数签名。如果你不想声明函数签名，那么你也可以这样：

```go
mybar := bar
Decorator(&mybar, bar)
mybar("hello,", "world!")
```

## Pipeline

### HTTP 处理

上一章节中提到：

```go
http.HandleFunc("/v4/hello", Handler(hello,
                WithServerHeader, WithBasicAuth, WithDebugLog))
```

### Channel 管理

#### Channel 转发函数

首先，我们需一个 `echo()`函数，其会把一个整型数组放到一个`Channel`中，并返回这个`Channel`

```go
func echo(nums []int) <-chan int {
  out := make(chan int)
  go func() {
    for _, n := range nums {
      out <- n
    }
    close(out)
  }()
  return out
}
```

然后，我们依照这个模式，我们可以写下这个函数。

#### 平方函数

```go
func sq(in <-chan int) <-chan int {
  out := make(chan int)
  go func() {
    for n := range in {
      out <- n * n
    }
    close(out)
  }()
  return out
}
```

#### 过滤奇数函数

```go
func odd(in <-chan int) <-chan int {
  out := make(chan int)
  go func() {
    for n := range in {
      if n%2 != 0 {
        out <- n
      }
    }
    close(out)
  }()
  return out
}
```

#### 求和函数

```go
func sum(in <-chan int) <-chan int {
  out := make(chan int)
  go func() {
    var sum = 0
    for n := range in {
      sum += n
    }
    out <- sum
    close(out)
  }()
  return out
}
```

#### 组合

```go
var nums = []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
for n := range sum(sq(odd(echo(nums)))) {
  fmt.Println(n)
}
```

上面的代码类似于我们执行了`Unix/Linux`命令： `echo $nums | sq | sum`

如果你不想有那么多的函数嵌套，你可以使用一个代理函数来完成：

```go
type EchoFunc func ([]int) (<- chan int)
type PipeFunc func (<- chan int) (<- chan int)

func pipeline(nums []int, echo EchoFunc, pipeFns ... PipeFunc) <- chan int {
  ch  := echo(nums)
  for i := range pipeFns {
    ch = pipeFns[i](ch)
  }
  return ch
}
```

```go
var nums = []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
for n := range pipeline(nums, gen, odd, sq, sum) {
    fmt.Println(n)
  }
```

### Fan in/Out

动用`Go`语言的 `Go Routine`和 `Channel`还有一个好处，就是可以写出`1`对多，或多对`1`的`pipeline`，也就是`Fan In/ Fan Out`。下面，我们来看一个`Fan in`的示例：

我们想通过并发的方式来对一个很长的数组中的质数进行求和运算，我们想先把数组分段求和，然后再把其集中起来。

主函数：

```go
func makeRange(min, max int) []int {
  a := make([]int, max-min+1)
  for i := range a {
    a[i] = min + i
  }
  return a
}

func main() {
  nums := makeRange(1, 10000)
  in := echo(nums)

  const nProcess = 5
  var chans [nProcess]<-chan int
  for i := range chans {
    chans[i] = sum(prime(in))
  }

  for n := range sum(merge(chans[:])) {
    fmt.Println(n)
  }
}
```

`prime()` 函数：

```go
func is_prime(value int) bool {
 for i := 2; i <= int(math.Floor(float64(value) / 2)); i++ {
   if value%i == 0 {
     return false
   }
 }
 return value > 1
}

func prime(in <-chan int) <-chan int {
 out := make(chan int)
 go func ()  {
   for n := range in {
     if is_prime(n) {
       out <- n
     }
   }
   close(out)
 }()
 return out
}
```

-   我们先制造了从`1`到`10000`的一个数组，
-   然后，把这堆数组全部 `echo`到一个`channel`里 – `in`
-   此时，生成 `5` 个 `Channel`，然后都调用 `sum(prime(in))` ，于是每个`Sum`的`Go Routine`都会开始计算和
-   最后再把所有的结果再求和拼起来，得到最终的结果。

`merge`代码：

```go
func merge(cs []<-chan int) <-chan int {
  var wg sync.WaitGroup
  out := make(chan int)

  wg.Add(len(cs))
  for _, c := range cs {
    go func(c <-chan int) {
      for n := range c {
        out <- n
      }
      wg.Done()
    }(c)
  }
  go func() {
    wg.Wait()
    close(out)
  }()
  return out
}
```

整体流程：

```
[]int -> echo -> 多个{prime->sum} -> merge -> int

```

## 泛型编程

Go 语言的 1.17 版本发布了，其中开始正式支持泛型了，但还有一些限制（比如，不能把泛型函数 export）。

### 初探

```go
package main

import "fmt"

func print[T any] (arr []T) {
  for _, v := range arr {
    fmt.Print(v)
    fmt.Print(" ")
  }
  fmt.Println("")
}

func main() {
  strs := []string{"Hello", "World",  "Generics"}
  decs := []float64{3.14, 1.14, 1.618, 2.718 }
  nums := []int{2,4,6,8}

  print(strs)
  print(decs)
  print(nums)
}
```

上面这个示例中，我们泛型的 `print()` 支持了三种类型的适配—— `int`型，`float64`型，和 `string`型。要让这段程序跑起来需要在编译行上加上 `-gcflags=-G=3`编译参数（这个编译参数会在`1.18`版上成为默认参数），如下所示：

```shell
go run -gcflags=-G=3 ./main.go
```

有了个操作以后，我们就可以写一些标准的算法了，比如，一个查找的算法

```go
func find[T comparable] (arr []T, elem T) int {
  for i, v := range arr {
    if  v == elem {
      return i
    }
  }
  return -1
}
```

Go 语言的泛型已基本可用了，只不过，还有三个问题：

-   一个是 `fmt.Printf()`中的泛型类型是 `%v` 还不够好，不能像`c++ iostream`重载 `>>` 来获得程序自定义的输出。
-   另外一个是，`go`不支持操作符重载，所以，你也很难在泛型算法中使用“泛型操作符”如：`==`  等
-   最后一个是，上面的 `find()` 算法依赖于“数组”，对于`hash-table`、`tree`、`graph`、`link`等数据结构还要重写。也就是说，没有一个像`C++ STL`那样的一个泛型迭代器（这其中的一部分工- 作当然也需要通过重载操作符（如：`++` 来实现）

### 数据结构

#### Stack 栈

编程支持泛型最大的优势就是可以实现类型无关的数据结构，下面，我们用`Slices`这个结构体来实现一个`Stack`的数结构。

首先，我们可以定义一个泛型的`Stack`：

```go
type stack [T any] []T
```

```go
func (s *stack[T]) push(elem T) {
  *s = append(*s, elem)
}

func (s *stack[T]) pop() {
  if len(*s) > 0 {
    *s = (*s)[:len(*s)-1]
  }
}
func (s *stack[T]) top() *T{
  if len(*s) > 0 {
    return &(*s)[len(*s)-1]
  }
  return nil
}

func (s *stack[T]) len() int{
  return len(*s)
}

func (s *stack[T]) print() {
  for _, elem := range *s {
    fmt.Print(elem)
    fmt.Print(" ")
  }
  fmt.Println("")
}
```

`top()`之前，我们返回的“空”值，要么是 `int` 的`0`，要么是 `string` 的 “”，然而在泛型的`T`下，这个值就不容易搞了。也就是说，除了类型泛型后，还需要有一些“值的泛型”（注：在`C++`中，如果你要用一个空栈进行 `top()` 操作，你会得到一个 `segmentation fault`），所以，这里我们返回的是一个指针，这样可以判断一下指针是否为空。

```go
func main() {

 ss := stack[string]{}
 ss.push("Hello")
 ss.push("Hao")
 ss.push("Chen")
 ss.print()
 fmt.Printf("stack top is - %v\n", *(ss.top()))
 ss.pop()
 ss.pop()
 ss.print()


 ns := stack[int]{}
 ns.push(10)
 ns.push(20)
 ns.print()
 ns.pop()
 ns.print()
 *ns.top() += 1
 ns.print()
 ns.pop()
 fmt.Printf("stack top is - %v\n", ns.top())

}
```
