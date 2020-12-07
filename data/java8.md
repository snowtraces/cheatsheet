---
title: java8
category: Java
updated: 2020-11-21
column_size: 2
---

### Lambda 表达式

```java
(int a) -> a * 2; // 求a乘以2后的值
a -> a * 2; // 或者更直接的去掉类型也是可以的
```
```java
(a, b) -> a + b; // 相加
```

#### 如果lambda里面的代码块超过1行，可以配合使用 `{ }` 加 `return`来处理

```java
(x, y) -> {
	int sum = x + y;
	int avg = sum / 2;
	return avg;
}
```

#### 一个lamdba表达式必须依赖一个具体的功能接口而存在

```java
interface MyMath {
    int getDoubleOf(int a);
}
	
MyMath d = a -> a * 2; // 关联到具体的接口实现
d.getDoubleOf(4); // is 8
```

#### 下面所有的测试都是用到这个`list` :

```java
List<String> list = [Bohr, Darwin, Galilei, Tesla, Einstein, Newton]
```


### Collections 集合

#### **sort** `sort(list, comparator)`

```java
// 正序
list.sort((a, b) -> a.length() - b.length())
list.sort(Comparator.comparing(n -> n.length()));
list.sort(Comparator.comparing(String::length));
//> [Bohr, Tesla, Darwin, Newton, Galilei, Einstein]

// 逆序
list.sort(Comparator.comparing(String::length).reversed());
```

#### **removeIf**

```java
list.removeIf(w -> w.length() < 6);
//> [Darwin, Galilei, Einstein, Newton]
```

#### **merge** `merge(key, value, remappingFunction)`

```java
Map<String, String> names = new HashMap<>();
names.put("Albert", "Ein?");
names.put("Marie", "Curie");
names.put("Max", "Plank");

//  "Albert" 这个值是存在的 就命中了后面处理流程
// {Marie=Curie, Max=Plank, Albert=Einstein}
names.merge("Albert", "stein", (old, val) -> old.substring(0, 3) + val);

// "Newname" 这个值是不存在的 所以后面的流程就不处理
// {Marie=Curie, Newname=stein, Max=Plank, Albert=Einstein}
names.merge("Newname", "stein", (old, val) -> old.substring(0, 3) + val);
```


### 方法引用 `Class::staticMethod` 

允许引用类方法或者构造函数，引用时候是不执行的

```java
//通过lamdba
getPrimes(numbers, a -> StaticMethod.isPrime(a));

//通过应用方法:
getPrimes(numbers, StaticMethod::isPrime);
```

| Method Reference        | Lambda Form                              |
| ----------------------- | ---------------------------------------- |
| `StaticMethod::isPrime` | `n -> StaticMethod.isPrime(n)`           |
| `String::toUpperCase`   | `(String w) -> w.toUpperCase()`          |
| `String::compareTo`     | `(String s, String t) -> s.compareTo(t)` |
| `System.out::println`   | `x -> System.out.println(x)`             |
| `Double::new`           | `n -> new Double(n)`                     |
| `String[]::new`         | `(int n) -> new String[n]`               |

### Optional

在Java, 通常使用`null`表示没有结果，但是如果不检查的话很容易出现`NullPointerException`.

```java
// Optional<String> 包含一个string 或 空
Optional<String> res = stream
   .filter(w -> w.length() > 10)
   .findFirst();

// 返回元素长度，如果不存在返回""的长度
int length = res.orElse("").length();

// 使用lambda作为一个返回值
res.ifPresent(v -> results.add(v));
```

返回一个 Optional

```java
Optional<Double> squareRoot(double x) {
   if (x >= 0) { 
        return Optional.of(Math.sqrt(x)); 
    } else { 
        return Optional.empty(); 
    }
}
```

## Streams 流式处理

和`collections`类似, 但有所不同:

 - 不能储存数据
 - 数据来源外部例如 (collection, file, db, web, ...)
 - `immutable`不可变性，不影响外部数据 (因为产生了一个新的stream)
 - `lazy`懒式处理 (只有在计算的时候才用到，不处理不用 !)
 
```java
// 仅仅计算前3个"filter"
Stream<String> longNames = list
   .filter(n -> n.length() > 8)
   .limit(3);
```

#### **创建一个stream**

```java
Stream<Integer> stream = Stream.of(1, 2, 3, 5, 7, 11);
Stream<String> stream = Stream.of("Jazz", "Blues", "Rock");
Stream<String> stream = Stream.of(myArray); // 通过数组
list.stream(); // 通过list

// Infinit stream [0; inf[
Stream<Integer> integers = Stream.iterate(0, n -> n + 1);
```

#### **集合结果集**

```java
//返回成一个数组 (::new 是构造函数的引用)
String[] myArray = stream.toArray(String[]::new);

// 返回成list或set
List<String> myList = stream.collect(Collectors.toList());
Set<String> mySet = stream.collect(Collectors.toSet());

// 返回成String
String str = list.collect(Collectors.joining(", "));

//返回成一个LinkedHashMap
list.stream().collect(Collectors.toMap(k -> k, v -> v, (a, b) -> a, LinkedHashMap::new));
//默认转换成HashMap
list.stream().collect(Collectors.toMap(k -> k, v -> v));
```

#### **map** `map(mapper)` 对每个元素进行类型转换

```java
// 对每个元素使用 "toLowerCase" 处理
res = stream.map(w -> w.toLowerCase());
res = stream.map(String::toLowerCase);
//> bohr darwin galilei tesla einstein newton

res = Stream.of(1,2,3,4,5).map(x -> x + 1);
//> 2 3 4 5 6
```

#### **filter** `filter(predicate)` 过滤处理，只保留匹配到的元素

```java
// 过掉保留 "E" 开头的元素
res = stream.filter(n -> n.startsWith("E"));
//> Einstein

res = Stream.of(1,2,3,4,5).filter(x -> x < 3);
//> 1 2
```

#### **reduce** 汇聚处理成为单一返回结果

```java
String reduced = stream
	.reduce("", (acc, el) -> acc + "|" + el);
//> |Bohr|Darwin|Galilei|Tesla|Einstein|Newton
```

#### **limit** `limit(maxSize)` 保留前`maxSize`个元素

```java
res = stream.limit(3);
//> Bohr Darwin Galilei
```

#### **skip** 忽略掉前`n`个元素

```java
res = strem.skip(2); // 忽略 Bohr 和 Darwin
//> Galilei Tesla Einstein Newton
```

#### **distinct** 去重

```java
res = Stream.of(1,0,0,1,0,1).distinct();
//> 1 0
```

#### **sorted** 排序 (必须使用 *Comparable* 接口)

```java
res = stream.sorted();
//> Bohr Darwin Einstein Galilei Newton Tesla 
```

#### **allMatch** 全匹配
```java
// 检查是否每个元素包含“e“
boolean res = words.allMatch(n -> n.contains("e"));
```

`anyMatch`: 只要其中一个元素包含"e"即可 <br>
`noneMatch`: 元素里面是否没有"e" 

#### **parallel** 返回一个并行的stream

#### **findAny** 在并行流上findFirst执行更快


### 原始类型的 Streams

原始类型的stream自动封装是低效的 (例如 Stream<Integer>) ，因为它需要对每个元素进行大量拆箱和装箱. 所以最好使用 `IntStream`, `DoubleStream`, 等等.

#### **初始化**

```java
IntStream stream = IntStream.of(1, 2, 3, 5, 7);
stream = IntStream.of(myArray); // 通过数组
stream = IntStream.range(5, 80); //  5 到 80范围

Random gen = new Random();
IntStream rand = gen(1, 9); // stream of randoms
```

如果需要把字段转换成 `Object`, `double`, `long`，使用对应的*mapToX*方法。

### Grouping 结果集

#### **Collectors.groupingBy**

```java
// 通过长度分组
Map<Integer, List<String>> groups = stream
	.collect(Collectors.groupingBy(w -> w.length()));
//> 4=[Bohr], 5=[Tesla], 6=[Darwin, Newton], ...
```

#### **Collectors.toSet**

```java
// 和之前一样但是使用的是Set
... Collectors.groupingBy(
	w -> w.substring(0, 1), Collectors.toSet()) ...
```

#### **Collectors.counting** 计算个数

#### **Collectors.summing__** 计算累加 `summingInt`, `summingLong`, `summingDouble` 

#### **Collectors.averaging__** 计算平均数 `averagingInt`, `averagingLong`, ...

```java
Collectors.averagingInt(String::length)
```

*PS*: 另外不要忘记 Optional (例如 `Map<T, Optional<T>>`) 有同样的处理方法 (例如 `Collectors.maxBy`).


### 并行 Streams 

#### **创建并行处理stream**

```java
Stream<String> parStream = list.parallelStream();
Stream<String> parStream = Stream.of(myArray).parallel();
```

#### **unordered** 能提高计算 `limit`，`distinct`的速度

```java
stream.parallelStream().unordered().distinct();
```

*PS*: 使用streams类库, 例如使用 `filter(x -> x.length() < 9)` 代替 `forEach` 和 `if`

### 注意引用推测限制

```java
interface Pair<A, B> {
    A first();
    B second();
}
```

一个 steam 类型 `Stream<Pair<String, Long>>` :

 - `stream.sorted(Comparator.comparing(Pair::first)) // 有效`
 - `stream.sorted(Comparator.comparing(Pair::first).thenComparing(Pair::second)) // 无效`

Java不能通过 `.comparing(Pair::first)`回调过来的数据来判断类型, 故 `Pair::first` 就不能这样用了

如果需要使用泛型接口的话需要显示写清楚，否则无效

```java
stream.sorted(
    Comparator.<Pair<String, Long>, String>comparing(Pair::first)
    .thenComparing(Pair::second)
) // 有效
```

## LocalDate

### 简介

在JAVA中，常用的处理日期和时间的类主要有`Date`，`Calendar`，而在JDK1.8中，新增了`LocalDate`、`LocalTime`、`LocalDateTime` 类的实例是不可变的对象，分别表示使用ISO-8601日历系统的日期、时间、日期和时间。它们提供了简单的日期或时间，并不包含当前的时间信息，也不包含与时区相关的信息。

### API

#### **now()** 静态方法，根据当前时间创建对象 
```java
LocalDate.now();
LocalTime.now();
LocalDateTime.now();
```

#### **of()** 静态方法，根据指定时间创建对象
```java
LocalDate.of(2020, 12, 2);
LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
```

#### **plus, minus** 向当前时间添加指定长度时间
```java
LocalDate.now().plusDays(30);
LocalDateTime.now().plusMonths(1);

LocalDate.now().minusDays(7);
LocalTime.now().minusHours(2);

LocalDate.now().plus(7, ChronoUnit.DAYS);
```

#### **isBefore、isAfter** 比较两个时间
```java
LocalDate.now().isAfter(LocalDate.now().minusDays(1))
```

### Instant 时间戳
用于`时间戳`的运算。它是以Unix元年(传统的设定为UTC时区1970年1月1日午夜时分)开始所经历的描述进行运算。

```java
Instant.now(); // 2020-12-02T09:24:27.306Z
Instant.now().toEpochMilli() // 1606901081664
System.currentTimeMillis() // 1606901089461
```

### Duration 和 Period
#### **Duration:** 用于计算两个“时间”间隔
```java
Instant now = Instant.now();
Instant oneHoursAfter = Instant.now().plus(1, ChronoUnit.HOURS);
Duration duration = Duration.between(now, oneHoursAfter);
System.out.println("duration = " + duration.getSeconds());
// > duration = 3600
```

#### **Period:** 用于计算两个“日期”间隔
```java
LocalDate now = LocalDate.now();
LocalDate aWeekAgo = LocalDate.now().minusDays(7);
Period period = Period.between(aWeekAgo, now);
System.out.println("period = " + period.getDays()); 
// > period = 7
```

### 日期操作
 
 - **TemporalAdjuster**: 时间校正器。
 - **TemporalAdjusters**: 该类通过静态方法提供了大量的常用 TemporalAdjuster 的实现。

```java
LocalDateTime date = LocalDateTime.now();
```

#### 本月第一天
```java
LocalDateTime firstday = date.with(TemporalAdjusters.firstDayOfMonth());

LocalDate now = LocalDate.now();
LocalDate firstday1 = LocalDate.of(now.getYear(), now.getMonth(), 1);
```
#### 本月最后一天
```java
LocalDateTime lastDay = date.with(TemporalAdjusters.lastDayOfMonth());
```

#### 上个月最后一天
```java
LocalDateTime next_lastday = date.with(TemporalAdjusters.lastDayOfMonth());
```

#### 下个周日
```java
LocalDate nextSunday = LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.SUNDAY));
```

#### 计算两个日期相差的月份数
```java
long betweenMONTHS = ChronoUnit.MONTHS.between(beforeDate, afterDate);
```

### 解析与格式化
#### 日期格式化成字符串
```java
LocalDate now = LocalDate.now();
System.out.println(now.format(DateTimeFormatter.ISO_DATE));
// > 2020-12-02

System.out.println(now.format(DateTimeFormatter.ofPattern("yyyy/MM/dd")));
// > 2020/12/02
```

#### 字符串解析成时间
```java
System.out.println(LocalDate.parse("2020/12/01", DateTimeFormatter.ofPattern("yyyy/MM/dd")));
// > 2020-12-01
```

### 时区

### 与传统时间的转换






