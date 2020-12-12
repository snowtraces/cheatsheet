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

## 来源 & 参考

 - [RESTful API 最佳实践 - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2018/10/restful-api-best-practices.html)