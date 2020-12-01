---
title: springCloud
category: Java
updated: 2020-11-21
column_size: 2
---

### 项目结构

项目在一个工程中，通过`module`进行组装。

```
├── xxx-common
├── xxx-eureka
├── xxx-gateway
├── xxx-service
│   ├── xxx-service-common
│   ├── xxx-service-a
│   ├── xxx-service-b
│   └── xxx-service-c
└── xxx-service-api
    ├── xxx-service-a-api
    ├── xxx-service-b-api
    └── xxx-service-c-api
```

`api`也可以不拆成多个`module`，直接根据文件夹进行区分


### 项目结构说明
| 名称               | 说明                                                 |
| ------------------ | ---------------------------------------------------- |
| xxx-common         | 工具类，异常类，通用对象等                           |
| xxx-eureka         | 注册中心，与服务无关，单独维护为保证版本一致性       |
| xxx-gateway        | 网关，对外统一出口；可通过过滤器实现拦截、鉴权等功能 |
| xxx-service        | 服务pom项目，主要管理公共依赖                        |
| xxx-service-common | 服务公共代码，如短信/支付、公共异常处理类等          |
| xxx-service-*      | 对应的具体服务，主要业务代码                         |
| xxx-service-*-api  | 对应的服务api，包含`pojo`，`feign`等                 |
