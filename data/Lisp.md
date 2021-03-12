---
title: Lisp
category: Code
updated: 2021-01-19
column_size: 3
---

## 构造过程抽象

程序设计的基本元素
- 基本表达形式
- 组合的方法
- 抽象的方法

### 表达式
```
(+ 3 5 )
8
(/ 10 5)
2
```
**前缀表示**，可以带任意个实参
```
(+ 1 3 5)
9
```
**可以嵌套**
```
(* (- 5 3) 10)
20
```
### 命名和环境

`define`定义变量
```
(define size 2)
```
```
size
2
(* 5 size)
10
```
值与符号关联，能够提取使用，形成了环境。

### 组合式的求值
- 求值各个子表达式
- 从最左表达式的值开始计算

例如，**树形积累**（值向上穿行）的计算过程。

### 复合过程

**过程定义**为复合操作命名
```
(define (square x) (* x x))
```
其一般形式为：
```
(define (name <参数> <body>))
```

### 过程应用的代换模型
树形积累的计算过程称为**代换模型**，帮助领会调用过程，并不是解释器的实际工作方式。

**正则序求值**，即*完全展开后归约*，先进行代换展开，不先局部计算

**应用序求值**，即*先求值参数而后应用*，为现在解释器的实现方式

### 条件表达式和谓词
`cond`表示条件
```
(define (abs x)
    (cond ((> x 0) x)
          ((= x 0) 0)
          ((< x 0) (- x))))
```
一般形式为：
```
(cond (<p1> <e1>)
      (<p2> <e2>)
      ...
      (<pn> <en>))
```
`pn`为谓词，被解释为真或假。

`if`为单条件表达式
```
(define (abs x) 
    (if (< x 0) 
        (- x)
        x))
```
| 谓词   | 解释   |
| ------ | ------ |
| `cond` | 条件   |
| `if`   | 单条件 |
| `<`    | 小于   |
| `=`    | 等于   |
| `>`    | 大于   |
| `and`  | 与     |
| `or`   | 或     |
| `not`  | 非     |

### 牛顿法求平方根
计算机科学里，更关心行动性的描述。牛顿法采用逐步逼近法，对`x`的平方根有一个猜测`y`，令`y = (x + x/y) / 2`，然后判断`y`够不够接近。
```
(define (sqrt-iter guess x) 
    (if (good-enough? guess x)
        guess
        (sqrt-iter (improve guess x) 
            x)))
```
其中`improve`:
```
(define (improve guess x) 
    (average guess (/ x guess)))
```
其中`average`:
```
(define (average x y)
    (/ (+ x y) 2))
```
足够好的定义，这里取误差`0.001`
```
(define (good-enough? guess x)
    (< (abs (- (square guess) x)) 0.001))
```
一般初始值取`1.0`，开方定义：
```
(define (sqrt x) 
    (sqrt-iter 1.0 x))
```
### 过程作为黑箱抽象
#### **局部名** 局部变量名不影响过程和结果
#### **内部定义和块结构** 
将所有辅助过程定义放到内部
```
(define (sqrt x) 
    (define (good-enough? guess x)
        (< (abs (- (square guess) x)) 0.001))
    (define (improve guess x) 
        (average guess (/ x guess)))
    (define (sqrt-iter guess x) 
        (if (good-enough? guess x)
            guess
            (sqrt-iter (improve guess x) x)))
    (sqrt-iter 1.0 x))
```
`x`定义在`sqrt`中，其他辅助过程均定义在`x`中，故可以让`x`作为内部定义中的自由变量：
```
(define (sqrt x) 
    (define (good-enough? guess)
        (< (abs (- (square guess) x)) 0.001))
    (define (improve guess) 
        (average guess (/ x guess)))
    (define (sqrt-iter guess) 
        (if (good-enough? guess)
            guess
            (sqrt-iter (improve guess))))
    (sqrt-iter 1.0))
```
## 过程与所产生的计算

### 线性的递归和迭代
阶乘的定义：
```
n!=n*(n-1)!
```
翻译成过程：
```
(define (factorial n)
    (if (= n 1)
        1
        (* n (factorial (- n 1)))))
```
其计算过程会先展开，直到`n==1`时才开始收敛，称为**递归计算过程**

另一种过程实现是`1*2*...(n-1)*n`:
```
(define (factorial n)
    (fact-iter 1 1 n))
(define (fact-iter product counter max-count)
    (if (> counter max-count)
        product
        (fact-iter (* counter product)
                   (+ counter 1)
                   max-count)))
```
从`1`开始计算到`n`结束，不会有发散和收敛的过程，称为**线性递归过程**

### 树形递归
另一种常见到的计算模式是`树形递归`，以**斐波那契**数序列的计算为例：
```
(define (fib n)
    (cond ((= n 0) 0)
          ((= n 1) 1)
          (else (+ (fib (- n 1))
                   (fib (- n 2))))))
```
每次计算分裂成两个，遇到`0`和`1`时收敛，做了大量冗余计算。

另外一种计算过程，从`0`和`1`开始计算：
```
(define (fib n)
    (fib-iter 1 0 n))
(define (fib-iter a b count)
    (if (= count 0)
        b
        (fib-iter (+ a b) a (- count 1))))
```

### 最大公约数
找到两个整数的做大公约数(GCD)的一种方法是对她们做因数分解，并找出公共因子，但存在一种更高效的算法（欧几里得算法）：

*如果`r`是`a`除以`b`的余数，那么`a`和`b`的GCD正好是`b`和`r`的GCD*，即：
```
r = a % b
GCD(a, b) = GCD(b, r) =  GCD(b, a % b)
```
过程实现；
```
(define (gcd a b)
    if (= b 0)
       a
       (gcd b (remainder a b))))
```

## 用高阶函数做抽象

### 过程作为参数
序列求和：
```
f(a)+...+f(b) 
```
模板抽象为：
```
(define (sum term a next b)
    (if (> a b)
        0
        (+ (term a)
           (sum term (next a) next b))))
```

### 用lambda构造过程
`lambda`和`define`使用同样的方式创建过程，但不为过程创建名字：
```
(lambda (<parameters>) <body>)
```
#### **用`let`创建局部变量**
```
(let ((<var1> <exp1>)
      (<var2> <exp2>)
      ...
      (<varn> <expn>))
    <body>
)
```


