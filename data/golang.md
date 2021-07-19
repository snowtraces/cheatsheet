---
title: golang
category: Go
updated: 2020-12-07
column_size: 2
---

### Credits

大部分例子来源于[A Tour of Go](http://tour.golang.org/), 是`Go`非常优秀的入门教程，如果你是新手，建议你先看看这个教程。

### 简述

 - 命令式语言
 - 静态类型
 - 类似于`C`的语法标记（但括号较少且没有分号），其结构类似于`Oberon-2`
 - 编译为原生代码（无虚拟机）
 - 没有类，但有带方法的结构
 - 接口
 - 没有实现继承。 不过，有[类型嵌入](http://golang.org/doc/effective%5Fgo.html#embedding)。
 - 函数是最重要的部分
 - 函数可以返回多个值
 - 闭包
 - 指针，但没有指针算术
 - 内置并发元支持：`Goroutine`和`Channels`

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
#### 只需通过return返回多个命名结果
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

### 结构 Struct

go没有类`class`，只有结构`struct`，结构可以拥有方法。struct 是一种类型，也是成员变量的集合。
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
#### **匿名struct:**，比`map[string]interface{}`更轻量和安全
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
#### 指向 Vertex 的指针类型为 *Vertex
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
 - 每个源文件顶部声明包
 - 可执行文件位于包`main`中
 - 约定：包名称 == 导入路径最后名称（导入路径`math/rand` => 包`rand`）
 - 大写标识符：`exported`（在其他包中可见）
 - 小写标识符：`private`（在其他包中不可见）

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
#### 与for和if一样，在switch值之前可以有一个赋值语句
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
#### 多个case可用逗号分割
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

Go中没有`子类`。 而是有`接口`和`结构`嵌入。

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
`Goroutines`是轻量级线程（由Go而不是OS管理）。 `go f(a, b)`启动一个新的goroutine，该例程将运行`f`（`f`是一个函数）。

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
#### 发送到nil通道将永远阻塞
```go
var c chan string
c <- "Hello, World!"
// fatal error: all goroutines are asleep - deadlock!
```

#### 接收自nil通道将永远阻塞
```go
var c chan string
fmt.Println(<-c)
// fatal error: all goroutines are asleep - deadlock!
```

#### 发送到已关闭通道触发panic

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

没有异常处理，可能会产生错误的函数只需声明类型为Error的附加返回值即可。 这是`Error`的接口：

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
类型switch类似于常规switch语句，但是类型switch中的case指定类型（不是值），并将这些类型与给定接口的类型进行比较。
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

