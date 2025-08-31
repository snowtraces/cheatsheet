---
title: ES|QL 语法速查表 (SQL vs ES|QL)
category: Databases
updated: 2025-08-31
column_size: 2
font_size: 12px
---

### 1. 数据源

```sql
| SQL                  | ES \| QL  |
| -------------------- | --------- |
| SELECT \* FROM logs; | FROM logs |
```

### 2. 条件过滤

```sql
| SQL                                   | ES \| QL                                  |
| ------------------------------------- | ----------------------------------------- |
| WHERE status = 200                    | \| WHERE status == 200                    |
| WHERE status != 404                   | \| WHERE status != 404                    |
| WHERE status IN (200, 201)            | \| WHERE status IN (200, 201)             |
| WHERE latency > 100 AND host = 'web1' | \| WHERE latency > 100 AND host == "web1" |
```

### 3. 字段选择

```sql
| SQL                                 | ES \| QL                        |
| ----------------------------------- | ------------------------------- |
| SELECT host, latency FROM logs;     | FROM logs \| KEEP host, latency |
| SELECT \* EXCEPT latency FROM logs; | FROM logs \| DROP latency       |
```

### 4. 计算字段

```sql
| SQL                                           | ES \| QL                                          |
| --------------------------------------------- | ------------------------------------------------- |
| SELECT latency/1000 AS latency_sec FROM logs; | FROM logs \| EVAL latency_sec = latency / 1000    |
| SELECT CONCAT(host, '-', status) FROM logs;   | FROM logs \| EVAL tag = CONCAT(host, "-", status) |
```

### 5. 聚合统计

```sql
| SQL                                                | ES \| QL                                              |
| -------------------------------------------------- | ----------------------------------------------------- |
| SELECT COUNT(\*) FROM logs;                        | FROM logs \| STATS COUNT(\*)                          |
| SELECT host, COUNT(\*) FROM logs GROUP BY host;    | FROM logs \| STATS COUNT(\*) BY host                  |
| SELECT host, AVG(latency) FROM logs GROUP BY host; | FROM logs \| STATS avg_latency = AVG(latency) BY host |
```

### 6. 排序 & 限制

```sql
| SQL                       | ES \| QL                 |
| ------------------------- | ------------------------ |
| ORDER BY avg_latency DESC | \| SORT avg_latency DESC |
| LIMIT 10                  | \| LIMIT 10              |
```

### 7. 时间函数

```sql
| SQL                                     | ES \| QL                                           |
| --------------------------------------- | -------------------------------------------------- |
| SELECT DATE_TRUNC('day', ts) FROM logs; | FROM logs \| EVAL day = DATE_TRUNC(1d, @timestamp) |
| SELECT NOW();                           | FROM logs \| EVAL now = NOW()                      |
```

### 8. 常见函数

```sql
| 类型   | SQL            | ES \| QL       |
| ------ | -------------- | -------------- |
| 字符串 | UPPER(host)    | UPPER(host)    |
| 数学   | ROUND(latency) | ROUND(latency) |
| 聚合   | SUM(bytes)     | SUM(bytes)     |
```

### 9. 完整例子

**SQL：**

```sql
SELECT host, COUNT(*) AS total, AVG(latency) AS avg_latency
FROM logs
WHERE status = 200
GROUP BY host
ORDER BY avg_latency DESC
LIMIT 5;
```

**ES|QL：**

```sql
FROM logs
| WHERE status == 200
| STATS total = COUNT(*), avg_latency = AVG(latency) BY host
| SORT avg_latency DESC
| LIMIT 5
```