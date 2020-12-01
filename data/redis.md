---
title: Redis
category: Databases
updated: 2020-09-08
column_size: 2
---

### 启动

```bash
./redis-server                      # 启动服务
./redis-server --daemonize yes      # 以守护进程运行
./redis-server --requirepass <pass> # 带密码启动
```
#### 以配置文件方式启动
```bash
./redis-server redis.conf & 

# redis.conf
daemonize yes
requirepass <pass>
```

### 登录
```bash
./redis-cli           # 登录
./redis-cli -p 6379   # 登录本机端口6379

:6379> auth <pass>    # 密码认证
```
#### 客户端参数
| code | description             |
| ---- | ----------------------- |
| `-h` | 主机                    |
| `-p` | 端口                    |
| `-a` | 密码 _命令行输入不安全_ |


## 操作

### string（字符串）

| code                                                 | description                         |
| ---------------------------------------------------- | ----------------------------------- |
| `APPEND` key value                                   | 追加                                |
| `BITCOUNT` key [start] [end]                         | 统计为1的位                         |
| `BITOP` [AND&#124;OR&#124;NOT&#124;XOR] key [key...] | 按位操作                            |
| `BITPOS` key bit [start] [end]                       | 查找字符串中第一个设置为1或0的bit位 |
| `DECR` key                                           | 数字减1并返回                       |
| `DECRBY` key value                                   | 数字减指定值并返回                  |
| `GET` key                                            | 获取值                              |
| `GETBIT` key offset                                  | 获取指定偏移量上的位(bit)           |
| `GETRANGE` key start end                             | 字符串截取                          |
| `GETSET` key value                                   | 设值，并返回旧值                    |
| `INCR` key                                           | 数字值加一                          |
| `INCRBY` key increment                               | 数字值加上增量                      |
| `INCRBYFLOAT` key increment                          | 数字值加上浮点数增量                |
| `MGET` key [key ...]                                 | 返回所有给定 key 的值               |
| `MSET` key value [key value ...]                     | 设置多个值                          |
| `MSETNX` key value [key value ...]                   | 如果不存在，设置多个值              |
| `PSETEX` key milliseconds value                      | 设置过期时间 (毫秒)                 |
| `SET` key value                                      | 设值                                |
| `SETBIT` key offset value                            | 设置指定偏移量上的位(bit)           |
| `SETEX` key seconds value                            | 设置过期时间 (秒)                   |
| `SETNX` key value                                    | 如果不存在，设值                    |
| `SETRANGE` key offset value                          | 从指定偏移量开始覆写值              |
| `STRLEN` key                                         | 获取长度                            |

### list（列表）

| code                                        | description                                                           |
| ------------------------------------------- | --------------------------------------------------------------------- |
| `BLPOP` key [key ...] timeout               | 阻塞式(blocking)左侧弹出                                              |
| `BRPOP` key [key ...] timeout               | 阻塞式(blocking)右侧弹出                                              |
| `BRPOPLPUSH` source destination timeout     | 阻塞式的`RPOPLPUSH`                                                   |
| `LINDEX` key index                          | 返回指定位置的值                                                      |
| `LINSERT` key BEFORE&#124;AFTER pivot value | 插入到特定值的前/后                                                   |
| `LLEN` key                                  | 列表长度                                                              |
| `LPOP` key                                  | 左侧（头）弹出                                                        |
| `LPUSH` key value [value ...]               | 值插入到列表头                                                        |
| `LPUSHX` key value                          | 列表存在时，值插入到列表头                                            |
| `LRANGE` key start stop                     | 查询指定范围值                                                        |
| `LREM` key count value                      | 移除count个value<br>count>0从头开始<br>count<0从尾开始<br>count=0全部 |
| `LSET` key index value                      | 指定位置设置值                                                        |
| `LTRIM` key start stop                      | 只保留指定范围值                                                      |
| `RPOP` key                                  | 右侧（尾）弹出                                                        |
| `RPOPLPUSH` source destination              | source尾部弹出，destination头部插入                                   |
| `RPUSH` key value [value ...]               | 值插入到列尾部                                                        |
| `RPUSHX` key value                          | 列表存在时，值插入到列尾部                                            |


### Client­/Server

| code            | description        |
| --------------- | ------------------ |
| `AUTH` password | 密码认证           |
| `ECHO` message  | 打印消息，用于测试 |
| `PING`          | 测试连接           |
| `QUIT`          | 关闭连接           |
| `SELECT` index  | 切换到指定的数据库 |

### set（集合）

显然，`set`会忽略重复元素
| code                                    | description           |
| --------------------------------------- | --------------------- |
| `SADD` key member [member ...]          | 添加元素              |
| `SCARD` key                             | 获取集合大小          |
| `SDIFF` key [key ...]                   | 获取集合差集          |
| `SDIFFSTORE` destination key [key ...]  | 存储集合差集          |
| `SINTER` key [key ...]                  | 获取集合交集          |
| `SINTERSTORE` destination key [key ...] | 存储集合交集          |
| `SISMEMBER` key member                  | 检查是否存在，返回0/1 |
| `SMEMBERS` key                          | 获取所有元素          |
| `SMOVE` source destination member       | 集合间移动元素        |
| `SPOP` key                              | 弹出一个随机元素      |
| `SRANDMEMBER` key                       | 获取一个随机元素      |
| `SREM` key member [member ...]          | 移除匹配的元素        |
| `SSCAN`                                 | 遍历                  |
| `SUNION` key [key ...]                  | 获取集合并集          |
| `SUNIONSTORE` destination key [key ...] | 存储集合并集          |


### database（数据库）

| code                       | description                      |
| -------------------------- | -------------------------------- |
| `DEL` key [key ...]        | 删除指定对象                     |
| `DUMP` key                 | 序列化对象                       |
| `EXISTS` key               | 检查是否存在                     |
| `EXPIRE` key seconds       | 设值过期时间（秒）               |
| `EXPIREAT` key timestamp   | 设值过期时间点（秒 timestamp）   |
| `KEYS` pattern             | 获取符合模式的所有key            |
| `MIGRATE`                  | redis实例间迁移数据              |
| `MOVE` key db              | 传输数据到指定数据库             |
| `OBJECT`                   | 内部检查项目                     |
| `PERSIST` key              | 移除过期时间，持久化对象         |
| `PEXPIRE` key milliseconds | 设值过期时间（毫秒）             |
| `PEXPIREAT` key timestamp  | 设值过期时间点（毫秒 timestamp） |
| `PTTL` key                 | 获取剩余生存时间（毫秒）         |
| `RANDOMKEY`                | 随机返回一个key                  |
| `RENAME` key newkey        | 改名                             |
| `RENAMENX` key newkey      | newkey不存在时，改名             |
| `RESTORE`                  | 反序列化                         |
| `SCAN`                     | 遍历                             |
| `SORT`                     | 返回排序后的副本                 |
| `TTL` key                  | 获取剩余生存时间（秒）           |
| `TYPE` key                 | 返回值的类型                     |


### Script（脚本）

redis支持`Lua`脚本
| code                                               | description        |
| -------------------------------------------------- | ------------------ |
| `EVAL` script numkeys key [key ...] arg [arg ...]  | 运行               |
| `EVALSHA` sha1 numkeys key [key ...] arg [arg ...] | 运行缓存脚本       |
| `SCRIPT EXISTS` script [script ...]                | 检查脚本是否已缓存 |
| `SCRIPT FLUSH`                                     | 清除所有脚本缓存   |
| `SCRIPT KILL`                                      | 杀死正在运行的脚本 |
| `SCRIPT LOAD` script                               | 缓存脚本           |

### Hash（哈希表）

| code                                      | description              |
| ----------------------------------------- | ------------------------ |
| `HDEL` key field [field ...]              | 移除指定的值             |
| `HEXISTS` key field                       | 判断给定域是否存在       |
| `HGET` key field                          | 获取指定域的值           |
| `HGETALL` key                             | 获取所有的域和值         |
| `HINCRBY` key field increment             | 给定域加一               |
| `HINCRBYFLOAT` key field increment        | 给定域加指定值           |
| `HKEYS` key                               | 获取所有域               |
| `HLEN` key                                | 获取域数量               |
| `HMGET` key field [field ...]             | 获取多个域的值           |
| `HMSET` key field value [field value ...] | 设值多个域的值           |
| `HSCAN`                                   | 迭代                     |
| `HSET` key field value                    | 设值域和值               |
| `HSETNX`  key field value                 | 如果域不存在，设值域和值 |
| `HVALS` key                               | 获取所有域的值           |

### SortedSet（有序集合）

| code                                         | description                |
| -------------------------------------------- | -------------------------- |
| `ZADD` key score member [[score member] ...] | 添加元素                   |
| `ZCARD` key                                  | 获取集合数量               |
| `ZCOUNT` key min max                         | 获取指定score间元素个数    |
| `ZINCRBY` key increment member               | 指定元素score加一          |
| `ZINTERSTORE`                                | 存储交集                   |
| `ZLEXCOUNT` KEY MIN MAX                      | 获取指定字典区间的元素个数 |
| `ZRANGE` key start stop [WITHSCORES]         | 获取指定下标区间内的成员   |
| `ZLEXRANGE` KEY MIN MAX                      | 获取指定字典区间的元素     |
| `ZRANGEBYSCORE` key min max                  | 获取指定score间的元素      |
| `ZRANK` key member                           | 返回元素排名               |
| `ZREM` key member [member ...]               | 删除元素                   |
| `ZREMRANGEBYLEX`                             | 删除指定字典区间的元素     |
| `ZREMRANGEBYRANK` key start stop             | 删除指定排名间的元素       |
| `ZREMRANGEBYSCORE` key min max               | 删除指定分数间的元素       |
| `ZREVRANGE`  key start stop [WITHSCORES]     | `ZRANGE` 逆序版本          |
| `ZREVRANGEBYSCORE`                           | `ZRANGE­BYSCORE`逆序版本   |
| `ZREVRANK` key member                        | `ZRANK` 逆序版本           |
| `ZSCAN`                                      | 迭代                       |
| `ZSCORE` key member                          | 获取score值                |
| `ZUNIONSTORE`                                | 存储并集                   |