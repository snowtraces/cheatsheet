---
title: beautifulCode
category: Code
updated: 2021-01-19
column_size: 2
---

 ### max(a, b)
 ```js
(b & (a - b >> 31) | a & ~(a - b >> 31))
```

### html随机颜色边框
```js
// 命令行中 $$ 等同于 document.querySelectorAll
[].forEach.call($$("*"), function (a) { a.style.outline = "1px solid #" + (~~(Math.random() * (1 << 24))).toString(16) })
```

### 评分
```js
let rating = 3;
"★★★★★☆☆☆☆☆".substring(5 - rating, 10 - rating);
```

### 值交换
```js
a = a ^ b
b = a ^ b
a = a ^ b
```
### 正则表达式简单解析器
| 字符 | 含义                       |
| ---- | -------------------------- |
| `c`  | 匹配任意的字母c            |
| `.`  | 匹配任意单个字符           |
| `^`  | 匹配输入字符串的开头       |
| `$`  | 匹配输入字符串的结尾       |
| `*`  | 匹配前一个字符的零个或多个 |

```js
const match = function (regexp, text) {
    if (regexp[0] === '^') {
        return matchHere(regexp.slice(1), text);
    }

    do {
        if (matchHere(regexp, text)) {
            return 1;
        }

    } while (text = text.slice(1))
    return 0;
}

const matchHere = function (regexp, text) {
    if (!regexp) {
        return 1;
    }
    if (regexp[1] === '*') {
        return matchStar(regexp[0], regexp.slice(2), text)
    }
    if (regexp[0] === '$' && !regexp[1]) {
        return text === ''
    }
    if (text !== '' && (regexp[0] === '.' || regexp[0] === text[0])) {
        return matchHere(regexp.slice(1), text.slice(1))
    }
    return 0;
}

const matchStar = function (c, regexp, text) {
    do {
        if (matchHere(regexp, text)) {
            return 1;
        }
    } while (text && ((text = text.slice(1))[0] === c || c === '.' ));
    return 0;
}

```
