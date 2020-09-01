--- 
title: markdown
category: markup
updated: 2020-08-31
---

### 标题

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
```

```markdown
一级标题
=======

二级标题
-------
```

### 强调

```markdown
*斜体*
_斜体_
```

```markdown
**加粗**
__加粗__
```

```markdown
`code`
```

### 列表

```markdown
* Item 1
* Item 2

+ Item 1
+ Item 2

- Item 1
- Item 2
```

```markdown
1. Item 1
2. Item 2
```

```markdown
- Item 1
- Item 2
  - Item 2.1
```

```markdown
- [ ] Checkbox off
- [x] Checkbox on
```

### 链接

```markdown
[百度](https://www.baidu.com)
```

```markdown
[百度][baidu]
[baidu]: https://www.baidu.com
```

```markdown
<https://www.baidu.com>
```

### 图片

```markdown
![Image alt text](/path/to/img.jpg)
![Image alt text](/path/to/img.jpg "alt title")
![Image alt text][img]
```

```markdown
[img]: http://foo.com/img.jpg
```

### 代码

```markdown
    4空格缩进
    自动生成代码块
```


~~~markdown
```
代码
```
~~~


~~~markdown
```js
指定语言类型的代码
```
~~~

### 区块引用

```markdown
> 这是
> 引用内容
>
> > 关联的
> > 引用内容
```

### 水平线

```markdown
----
```

```markdown
****
```

### 表格

```markdown
| column 1  | column 2  |
| --------- | --------- |
| content 1 | content 2 |
```

```markdown
 column 1  | column 2  
 --------- | --------- 
 content 1 | content 2 
```