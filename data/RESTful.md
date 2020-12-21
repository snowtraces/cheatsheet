---
title: RESTful
category: api
updated: 2020-12-11
column_size: 2
---

*REST*，即**Representational State Transfer**的缩写——"表现层状态转化"。如果一个架构符合REST原则，就称它为RESTful架构。

## URL设计

### 动词 + 宾语

RESTful的核心思想就是，客户端发出的数据操作指令都是"动词 + 宾语"的结构。比如，`GET /articles`这个命令，`GET`是动词，`/articles`是宾语。
| 动词   | 操作                           |
| ------ | ------------------------------ |
| GET    | 读取（Read）                   |
| POST   | 新建（Create）                 |
| PUT    | 更新（Update）                 |
| PATCH  | 更新（Update），通常是部分更新 |
| DELETE | 删除（Delete）                 |

### 动词的覆盖
有些客户端只能使用`GET`和`POST`这两种方法，服务器必须接受`POST`模拟其他三个方法（`PUT`、`PATCH`、`DELETE`）。

通过`X-HTTP-Method-Override`属性，告诉服务器覆盖的是哪种请求。

```nginx
POST /api/Person/4 HTTP/1.1  
X-HTTP-Method-Override: PUT
```

### 宾语必须是名词

宾语显然是名称，它是API的URL，是HTTP动词作用的对象。比如，`/articles`这个URL就是正确的，而下面的URL是错误的:

 - /getAllCars
 - /createNewCar
 - /deleteAllRedCars

### 复数 URL

既然URL是名词，那么应该使用复数，还是单数？

这没有统一的规定，但是常见的操作是读取一个集合，比如`GET /articles`（读取所有文章），这里明显应该是复数。

为了统一起见，建议都使用复数URL，比如`GET /articles/2`要好于`GET /article/2`。

### 避免多级 URL
常见的情况是，资源需要多级分类，因此很容易写出多级的 URL，比如获取某个作者的某一类文章。
```nginx
GET /articles/authors/12/categories/2
```
这种 URL 不利于扩展，语义也不明确。

更好的做法是，除了第一级，其他级别都用查询字符串表达。
```nginx
GET /articles?authors=12&categories=2
```
下面是另一个例子，查询已发布的文章：
```nginx
GET /articles/published
```
查询字符串的写法明显更好。
```nginx
GET /articles?published=true
```

## 状态码

### 状态码必须精确

客户端的每一次请求，服务器都必须给出回应。回应包括 **HTTP状态码**和**数据**两部分。

HTTP状态码就是一个三位数，分成五个类别。

| code | desc       |
| ---- | ---------- |
| 1xx  | 相关信息   |
| 2xx  | 操作成功   |
| 3xx  | 重定向     |
| 4xx  | 客户端错误 |
| 5xx  | 服务器错误 |

API不需要`1xx`状态码，下面介绍其他四类状态码的精确含义。

### 2xx 状态码

`200`状态码表示操作成功，但是不同的方法可以返回更精确的状态码。

| HTTP方法 | 响应           | 描述           |
| -------- | -------------- | -------------- |
| GET      | 200 OK         | 成功           |
| POST     | 201 Created    | 生成了新的资源 |
| PUT      | 200 OK         | 成功           |
| PATCH    | 200 OK         | 成功           |
| DELETE   | 204 No Content | 资源已经不存在 |

此外，`202 Accepted`表示已经收到请求，会在未来处理，通常用于**异步操作**

```nginx
HTTP/1.1 202 Accepted

{
  "task": {
    "href": "/api/company/job-management/jobs/2130040",
    "id": "2130040"
  }
}
```

### 3xx 状态码

#### 应用级别，浏览器会直接跳转

| code | desc       |
| ---- | ---------- |
| 301  | 永久重定向 |
| 302  | 暂时重定向 |
| 307  | 暂时重定向 |

#### API级别

| code | desc                        |
| ---- | --------------------------- |
| 303  | See Other，示参考另一个 URL |

`303`与`302`和`307`的含义一样，也是**暂时重定向**。区别在于`302`和`307`用于**GET**请求，而`303`用于**POST**、**PUT**和**DELETE**请求。收到`303`以后，浏览器不会自动跳转，而会让用户自己决定下一步怎么办：

```nginx
HTTP/1.1 303 See Other
Location: /api/orders/12345
```

### 4xx 状态码

`4xx`状态码表示客户端错误，主要有下面几种。
| code                       | desc                           |
| -------------------------- | ------------------------------ |
| 400 Bad Request            | 无法解析，一般是参数错误       |
| 401 Unauthorized           | 没有通过身份验证               |
| 403 Forbidden              | 通过了身份验证，但没有相关权限 |
| 404 Not Found              | 请求的资源不存在，或不可用     |
| 405 Method Not Allowed     | 所用的HTTP方法不允许           |
| 410 Gone                   | 资源已从这个地址转移，不再可用 |
| 415 Unsupported Media Type | 客户端要求的返回格式不支持     |
| 422 Unprocessable Entity   | 客户端上传的附件无法处理       |
| 429 Too Many Requests      | 客户端的请求次数超过限额       |

### 5xx 状态码
`5xx`表示服务端错误。一般来说，API 不会向用户透露服务器的详细信息。
| code                      | desc                               |
| ------------------------- | ---------------------------------- |
| 500 Internal Server Error | 客户端请求有效，服务器发生了错误   |
| 503 Service Unavailable   | 服务器无法处理请求，多用于维护状态 |

## 服务器响应

### 响应数据格式
API 返回的数据格式，应该是一个`JSON`对象，所以：
 - 服务器响应时HTTP头`Content-Type`属性设为`application/json`
 - 客户端请求时请求时HTTP头`ACCEPT`属性设成`application/json`

### 错误时，不返回200状态码
有一种**不恰当**的做法是，即使发生错误，也返回200状态码，把错误信息放在数据体里面：
```nginx
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "failure",
  "data": {
    "error": "Expected at least two items in list."
  }
}
```
上面代码中，解析数据体以后，才能得知操作失败。

这张做法实际上取消了状态码，这是完全不可取的。正确的做法是，状态码反映发生的错误，具体的错误信息放在数据体里面返回。下面是一个例子。
```nginx
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Invalid payoad.",
  "detail": {
     "surname": "This field is required."
  }
}
```
### 提供链接

API 的使用者未必知道，URL 是怎么设计的。一个解决方法就是，在回应中，给出相关链接，便于下一步操作。这样的话，用户只要记住一个 URL，就可以发现其他的 URL。这种方法叫做`HATEOAS`。

举例来说，GitHub 的 API 都在 [api.github.com](api.github.com) 这个域名。访问它，就可以得到其他 URL。
```nginx
{
  ...
  "feeds_url": "https://api.github.com/feeds",
  "followers_url": "https://api.github.com/user/followers",
  "following_url": "https://api.github.com/user/following{/target}",
  "gists_url": "https://api.github.com/gists{/gist_id}",
  "hub_url": "https://api.github.com/hub",
  ...
}
```
上面的响应中，挑一个 URL 访问，又可以得到别的 URL。对于用户来说，不需要记住 URL 设计，只要从 api.github.com 一步步查找就可以了。

HATEOAS 的格式没有统一规定，上面例子中，GitHub 将它们与其他属性放在一起。更好的做法应该是，将相关链接与其他属性分开。
```nginx
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "In progress",
   "links": {[
    { "rel":"cancel", "method": "delete", "href":"/api/status/12345" } ,
    { "rel":"edit", "method": "put", "href":"/api/status/12345" }
  ]}
}
```

## RESTful 成熟度

### Richardson 成熟度模型

[RESTful Web APIs](https://book.douban.com/subject/22139962/)和[RESTful Web Services](https://book.douban.com/subject/2054201/)的作者伦纳德 · 理查德森（Leonard Richardson），曾提出过一个衡量**服务有多么 REST**的 *Richardson 成熟度模型*（[Richardson Maturity Model](https://martinfowler.com/articles/richardsonMaturityModel.html)，RMM）。这个模型的一个用处是，方便那些原本不使用 REST 的服务，能够逐步导入 REST。

Richardson 将服务接口按照“REST 的程度”，从低到高分为 0 至 3 共 4 级：
 - `The Swamp of Plain Old XML`：完全不 REST。另外，关于 POX 这个说法，SOAP 表示感觉有被冒犯到。
 - `Resources`：开始引入资源的概念。
 - `HTTP Verbs`：引入统一接口，映射到 HTTP 协议的方法上。
 - `Hypermedia Controls`：在咱们课程里面的说法是“超文本驱动”，在 Fielding 论文里的说法是 Hypertext as the Engine of Application State（HATEOAS），都说的是同一件事情。

接下来，我们通过马丁 · 福勒（Martin Fowler）的关于 RMM 的文章中的实际例子（[原文](https://martinfowler.com/articles/richardsonMaturityModel.html)是 XML 写的，我简化了一下），来看看四种不同程度的 REST 反应到实际 API 是怎样的。

假设，你是一名软件工程师，接到需求（也被我尽量简化了）的用户故事是这样的：现在要开发一个医生预约系统，病人通过这个系统，可以知道自己熟悉的医生在指定日期是否有空闲时间，以方便预约就诊。

### 第 0 级成熟度：The Swamp of Plain Old XML

医院开放了一个 `/appointmentService` 的 Web API，传入日期、医生姓名作为参数，就可以得到该时间段、该医生的空闲时间。
```js
POST /appointmentService?action=query HTTP/1.1
{date: "2020-03-04", doctor: "mjones"}
```
在接收到请求之后，服务器会传回一个包含所需信息的结果：
```js
HTTP/1.1 200 OK
[
    {start:"14:00", end: "14:50", doctor: "mjones"},
    {start:"16:00", end: "16:50", doctor: "mjones"}
]
```
得到了医生空闲的结果后，我觉得 14:00 的时间比较合适，于是预约确认，并提交了我的基本信息：
```js
POST /appointmentService?action=comfirm HTTP/1.1
{
    appointment: {date: "2020-03-04", start:"14:00", doctor: "mjones"},
    patient: {name: xx, age: 30, ……}
}
```
如果预约成功，那我能够收到一个预约成功的响应：
```js
HTTP/1.1 200 OK
{
    code: 0,
    message: "Successful confirmation of appointment"
}
```
如果发生了问题，比如有人在我前面抢先预约了，那么我会在响应中收到某种错误信息：
```js
HTTP/1.1 200 OK
{
    code: 1
    message: "doctor not available"
}
```
到此，整个预约服务就完成了，可以说是直接明了。
在这个方案里，我们采用的是非常直观的基于 RPC 风格的服务设计，看似是很轻松地解决了所有问题，但真的是这样吗？

### 第 1 级成熟度：Resources

实际上你可以发现，第 0 级是 RPC 的风格，所以如果需求永远不会变化，也不会增加，那它完全可以良好地工作下去。但是，如果你不想为预约医生之外的其他操作、为获取空闲时间之外的其他信息去编写额外的方法，或者改动现有方法的接口，那就应该考虑一下如何使用 REST 来抽象资源。

通往 REST 的第一步是引入资源的概念，在 API 中最基本的体现，就是它会围绕着资源而不是过程来设计服务。说得直白一点，你可以理解为服务的 `Endpoint` 应该是一个**名词**而不是动词。此外，每次请求中都应包含资源 ID，所有操作均通过资源 ID 来进行。
```js
POST /doctors/mjones HTTP/1.1
{date: "2020-03-04"}
```
然后，服务器传回一个包含了 ID 的信息。注意，ID 是资源的唯一编号，有 ID 即代表“医生的档期”被视为一种资源：
```js
HTTP/1.1 200 OK
[
    {id: 1234, start:"14:00", end: "14:50", doctor: "mjones"},
    {id: 5678, start:"16:00", end: "16:50", doctor: "mjones"}
]
```
我还是觉得 14:00 的时间比较合适，于是又预约确认，并提交了我的基本信息：
```js
POST /schedules/1234 HTTP/1.1
{name: xx, age: 30, ……}
```
后面预约成功或者失败的响应消息在这个级别里面与之前一致，就不重复了。

比起第 0 级，第 1 级的服务抽象程度有所提高，但至少还有三个问题并没有解决：
 - 只处理了查询和预约，如果我要调整或取消预约，这都需要提供新的服务接口。
 - 处理结果响应时，只能靠着结果中的 code、message 这些字段做分支判断，多个系统要设计多套。
 - 并没有考虑认证授权等安全方面的内容。
 
这三个问题，其实都可以通过引入统一接口（`Uniform Interface`）来解决。接下来，我们就来到了第 2 级。

### 第 2 级成熟度：HTTP Verbs

前面说到，第 1 级中遗留的这三个问题，都可以靠引入统一接口来解决，而 HTTP 协议的标准方法便是最常接触到的统一接口。

HTTP 协议的标准方法是经过精心设计的，它几乎涵盖了资源可能遇到的所有操作场景（这其实更取决于架构师的抽象能力）。

那么，REST 的做法是：
 - 针对预约变更的问题，把不同业务需求抽象为对资源的增加、修改、删除等操作来解决；
 - 针对响应代码的问题，使用 HTTP 协议的 Status Code，可以涵盖大多数资源操作可能出现的异常（而且也是可以自定义扩展的）；
 - 针对安全性的问题，依靠 HTTP Header 中携带的额外认证、授权信息来解决

按这个思路，我们在获取医生档期时，应该使用具有查询语义的 GET 操作来完成：
```js
GET /doctors/mjones/schedule?date=2020-03-04&status=open HTTP/1.1
```
然后，服务器会传回一个包含了所需信息的结果：
```js
HTTP/1.1 200 OK
[
    {id: 1234, start:"14:00", end: "14:50", doctor: "mjones"},
    {id: 5678, start:"16:00", end: "16:50", doctor: "mjones"}
]
```
我还是觉得 14:00 的时间比较合适，于是就预约确认，并提交了我的基本信息用来创建预约。这是符合 POST 的语义的：
```js
POST /schedules/1234 HTTP/1.1
{name: xx, age: 30, ……}
```
如果预约成功，那我能够收到一个预约成功的响应：
```js
HTTP/1.1 201 Created
Successful confirmation of appointment
```
否则，我会在响应中收到某种错误信息：
```js
HTTP/1.1 409 Conflict
doctor not available
```
目前绝大多数的系统能够达到的 REST 级别，也就是第 2 级了。不过这种方案还不够完美，**最主要的一个问题是**：我们如何知道预约 mjones 医生的档期，需要访问`/schedules/1234`这个服务 Endpoint？

### 第 3 级成熟度：Hypermedia Controls

或许你第一眼看到这个问题会说，这当然是程序写的啊，我为什么会问这么奇怪的问题。但问题是，REST 并不认同这种已烙在程序员脑海中许久的想法。

RMM 中的第 3 级成熟度 `Hypermedia Controls`、Fielding 论文中的 `HATEOAS` 和现在提得比较多的`超文本驱动`，其实都是希望能达到这样一种效果：**除了第一个请求是由你在浏览器地址栏输入的信息所驱动的之外，其他的请求都应该能够自己描述清楚后续可能发生的状态转移，由超文本自身来驱动。**

所以，当你输入了查询命令后：
```js
GET /doctors/mjones/schedule?date=2020-03-04&statu s=open HTTP/1.1
```
服务器传回的响应信息应该包括如何预约档期、如何了解医生信息等可能的后续操作：
```js
HTTP/1.1 200 OK
{
    schedules：[
        {
            id: 1234, start:"14:00", end: "14:50", doctor: "mjones",
            links: [
                {rel: "comfirm schedule", href: "/schedules/1234"}
            ]
        },
        {
            id: 5678, start:"16:00", end: "16:50", doctor: "mjones",
            links: [
                {rel: "comfirm schedule", href: "/schedules/5678"}
            ]
        }
   ],
   links: [
       {rel: "doctor info", href: "/doctors/mjones/info"}
   ]
}
```

如果做到了第 3 级 REST，那么服务端的 API 和客户端就可以做到完全解耦了。这样一来，你再想要调整服务数量，或者同一个服务做 API 升级，将会变得非常简单。

## REST 的不足与争议

### `争议一` 面向资源只适合做 CRUD

面向资源的编程思想只适合做 CRUD，只有面向过程、面向对象编程才能处理真正复杂的业务逻辑。原因也很简单，HTTP 的 4 个最基础的命令 POST、GET、PUT 和 DELETE，很容易让人联想到 CRUD 操作。

REST 涵盖的范围当然远不止于此。不过要说 POST、GET、PUT 和 DELETE 对应于 CRUD，其实也没什么不对，只是我们必须泛化地去理解这个 CRUD：它们涵盖了信息在客户端与服务端之间流动的几种主要方式（比如 POST、GET、PUT 等标准方法），所有基于网络的操作逻辑，都可以通过解决“信息在服务端与客户端之间如何流动”这个问题来理解，有的场景里比较直观，而另一些场景中可能比较抽象。

针对那些比较抽象的场景，如果确实不好把 HTTP 方法映射为资源的所需操作，REST 也并不会刻板地要求一定要做映射。这时，用户可以使用自定义方法，按 Google 推荐的 REST API 风格来拓展 HTTP 标准方法。

**自定义方法应该放在资源路径末尾，嵌入冒号加自定义动词的后缀**。比如，我将删除操作映射到标准 DELETE 方法上，此外还要提供一个恢复删除的 API，那它可能会被设计为：
```js
POST /user/user_id/cart/book_id:undelete
```

要实现恢复删除，一个完全可行的设计是：设计一个**回收站**的资源，在那里保留还能被恢复的商品，我们把恢复删除看作是对这个资源的某个状态值的修改，映射到 PUT 或者 PATCH 方法上。

最后，我要再重复一遍，**面向资源**的编程思想与另外两种主流编程（**面向过程**和**面向对象**编程）思想，只是抽象问题时所处的立场不同，只有选择问题，没有高下之分：
 - **面向过程**编程时，为什么要以算法和处理过程为中心，输入数据，输出结果？当然是为了符合计算机世界中主流的交互方式。
 - **面向对象**编程时，为什么要将数据和行为统一起来、封装成对象？当然是为了符合现实世界的主流交互方式。
 - **面向资源**编程时，为什么要将数据（资源）作为抽象的主体，把行为看作是统一的接口？当然是为了符合网络世界的主流的交互方式。

### `争议二` REST 与 HTTP 完全绑定，不适用于要求高性能传输

其实，我在很大程度上赞同这个观点，但我并不认为这是 REST 的缺陷，因为锤子不能当扳手用，并不是锤子的质量有问题。

面向资源编程与协议无关，但是 REST（特指 Fielding 论文中所定义的 REST，而不是泛指面向资源的思想）的确依赖着 HTTP 协议的标准方法、状态码和协议头等各个方面。

我们也知道，HTTP 是应用层协议，而不是传输层协议，如果我们只是把 HTTP 用作传输是不恰当的（SOAP：再次感觉有被冒犯到）。因此，对于需要直接控制传输（如二进制细节 / 编码形式 / 报文格式 / 连接方式等）细节的场景，REST 确实不合适。这些场景往往存在于服务集群的内部节点之间，虽然 REST 和 RPC 的应用场景的确有所重合，但重合的范围有多大就是见仁见智的事情了。

### `争议三` REST 不利于事务支持

其实，这个问题首先要看我们怎么去理解**事务（Transaction）**这个概念了。

 - 如果“事务”指的是数据库那种狭义的刚性 ACID 事务，那分布式系统本身跟它之间就是有矛盾的（CAP 不可兼得）。这是分布式的问题，而不是 REST 的问题。

 - 如果“事务”是指通过服务协议或架构，在分布式服务中，获得对多个数据同时提交的统一协调能力（2PC/3PC），比如WS-AtomicTransaction和WS-Coordination这样的功能性协议，那 REST 确实不支持。假如你已经理解了这样做的代价，仍决定要这样做的话，Web Service 是比较好的选择。
 
 - 如果“事务”是指希望保证数据的最终一致性，说明你已经放弃刚性事务了。这才是分布式系统中的主流，使用 REST 肯定不会有什么阻碍，更谈不上“不利于”事务支持（当然，对于最终一致性的问题，REST 本身并没有提供什么帮助，而是完全取决于你系统的事务设计）。

### `争议四` REST 没有传输可靠性支持

是的，REST 并没有提供对传输可靠性的支持。在 HTTP 中，你发送出去一个请求，通常会收到一个与之相对的响应，比如 `HTTP/1.1 200 OK` 或者 `HTTP/1.1 404 Not Found` 等。但是，如果你没有收到任何响应，那就无法确定消息到底是没有发送出去，还是没有从服务端返回回来。这其中的关键差别，是服务端到底是否被触发了某些处理？

应对传输可靠性最简单粗暴的做法，就是把消息再重发一遍。这种简单处理能够成立的前提，是服务具有**幂等性（Idempotency）**，也就是说服务被重复执行多次的效果与执行一次是相等的。

**HTTP 协议要求 GET、PUT 和 DELETE 操作应该具有幂等性，我们把 REST 服务映射到这些方法时，也应该保证幂等性。**

对于 POST 方法，曾经有过一些专门的提案（比如POE、POST Once Exactly），但并未得到 IETF 的通过。对于 POST 的重复提交，浏览器会出现相应警告，比如 Chrome 中会有“确认重新提交表单”的提示。而服务端就应该做预校验，如果发现可能重复，就返回 HTTP/1.1 425 Too Early。

另外，Web Service 中有WS-ReliableMessaging功能协议，用来支持消息可靠投递。类似的，REST 因为没有采用额外的 Wire Protocol，所以除了缺少对事务、可靠传输的支持外，一定还可以在 WS-* 协议中找到很多 REST 不支持的特性。

### `争议五` REST 缺乏对资源进行“部分”和“批量”的处理能力

这个观点我是认同的，而且我认为这很可能是未来面向资源的思想和 API 设计风格的发展方向。

REST 开创了面向资源的服务风格，却肯定不完美。以 HTTP 协议为基础，虽然给 REST 带来了极大的便捷（不需要额外协议，不需要重复解决一堆基础网络问题，等等），但也成了束缚 REST 的无形牢笼。

关于 HTTP 协议对 REST 的束缚，我会通过具体的例子和你解释。

#### 第一种束缚，就是缺少对资源的“部分”操作的支持。

有些时候，我们只是想获得某个用户的姓名，RPC 风格中可以设计一个`getUsernameById`的服务，返回一个字符串。尽管这种服务的通用性实在称不上“设计”二字，但确实可以工作。而要是采用 REST 风格的话，你需要向服务端请求整个用户对象，然后丢弃掉返回结果中的其他属性，这就是一种请求冗余（Overfetching）。

REST 的应对手段是，通过位于中间节点或客户端缓存来缓解。但这治标不治本，因为这个问题的根源在于，HTTP 协议对请求资源完全没有结构化的描述能力（但有的是非结构化的部分内容获取能力，也就是今天多用于端点续传的Range Header），所以返回资源的哪些内容、以什么数据类型返回等等，都不可能得到协议层面的支持。如果要实现这种能力，你就只能自己在 GET 方法的 Endpoint 上设计各种参数。

#### 而与此相对的缺陷，也是 HTTP 协议对 REST 的第二种束缚，是对资源的“批量”操作的支持。

有时候，我们不得不为此而专门设计一些抽象的资源才能应对。

比如，我们要把某个用户的昵称增加一个“VIP”前缀，那提交一个 PUT 请求修改这个用户的昵称就可以了。但如果我们要给 1000 个用户的昵称加“VIP”前缀时，就不得不先创建一个（比如名为“VIP-Modify-Task”）任务资源，把 1000 个用户的 ID 交给这个任务，最后驱动任务进入执行状态（如果真去调用 1000 次 PUT，等浏览器回应我们 HTTP/1.1 429 Too Many Requests 的时候，老板就要发飙了）。

又比如，我们在网店买东西的时候，下单、冻结库存、支付、加积分、扣减库存这一系列步骤会涉及多个资源的变化，这时候我们就得创建一种“事务”的抽象资源，或者用某种具体的资源（比如“结算单”），贯穿网购这个过程的始终，每次操作其他资源时都带着事务或者结算单的 ID。对于 HTTP 协议来说，由于它的无状态性，相对来说不适用于（并非不能够）处理这类业务场景。

要解决批量操作这类问题，目前一种从理论上看还比较优秀的解决方案是GraphQL（但实际使用人数并不多）。GraphQL 是由 Facebook 提出并开源的一种面向资源 API 的数据查询语言。它和 SQL 一样，挂了个“查询语言”的名字，但其实 CRUD 都能做。

相对于依赖 HTTP 无协议的 REST 来说，GraphQL 是另一种“有协议”地、更彻底地面向资源的服务方式。但是凡事都有两面，离开了 HTTP，GraphQL 又面临着几乎所有 RPC 框架都会遇到的如何推广交互接口的问题。

## 来源 & 参考

 - [RESTful API 最佳实践 - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2018/10/restful-api-best-practices.html)
 - [RESTful服务（下）：如何评价服务是否RESTful？](https://time.geekbang.org/column/article/317191)