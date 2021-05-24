---
title: CSS
category: CSS
updated: 2021-04-22
column_size: 2
from: https://raw.githubusercontent.com/rstacruz/cheatsheets/master/css.md
---

### 选择器

```css
.class {
  font-weight: bold;
}
```
| Selector          | Description |
| ----------------- | ----------- |
| `*`               | 所有元素    |
| `div`             | 标签        |
| `.class`          | Class       |
| `#id`             | ID          |
| `[disabled]`      | 属性        |
| `[role="dialog"]` | 属性        |

### 组合

| Selector            | Description     |
| ------------------- | --------------- |
| `.parent .child`    | 子级            |
| `.parent > .child`  | 直接子级        |
| `.child + .sibling` | 相邻同级        |
| `.child ~ .sibling` | 非相邻同级      |
| `.class1.class2`    | 同时有两个class |

### 属性选择器

| Selector           | Description               |
| ------------------ | ------------------------- |
| `[role="dialog"]`  | `=` 相等                  |
| `[class~="box"]`   | `~=` 包含单词（空格分隔） |
| `[class\|="box"]`  | `\|=` 相对或前缀          |
| `[href$=".doc"]`   | `$=` 以结尾               |
| `[href^="/index"]` | `^=` 以开头               |
| `[class*="-is-"]`  | `*=` 包含                 |

### 伪类

| Selector             | Description                |
| -------------------- | -------------------------- |
| `:target`            |                            |
| ---                  | ---                        |
| `:disabled`          |                            |
| `:focus`             |                            |
| `:active`            |                            |
| ---                  | ---                        |
| `:nth-child(3)`      | 第3个子元素                |
| `:nth-child(3n+2)`   |                            |
| `:nth-child(-n+4)`   |                            |
| ---                  | ---                        |
| `:nth-last-child(2)` |                            |
| `:nth-of-type(2)`    |                            |
| ---                  | ---                        |
| `:checked`           | Checked inputs             |
| `:disabled`          | Disabled elements          |
| `:default`           | Default element in a group |
| ---                  | ---                        |
| `:empty`             | 无子级的元素               |

### 伪类变体

| Selector          |
| ----------------- |
| `:first-of-type`  |
| `:last-of-type`   |
| `:nth-of-type(2)` |
| `:only-of-type`   |
| ---               |
| `:first-child`    |
| `:last-child`     |
| `:nth-child(2)`   |
| `:only-child`     |

## 字体

### 属性值

| Property           | Description                          |
| ------------------ | ------------------------------------ |
| `font-family:`     | `<font>, <fontN>`                    |
| `font-size:`       | `<size>`                             |
| `letter-spacing:`  | `<size>`                             |
| `line-height:`     | `<number>`                           |
| ---                | ---                                  |
| `font-weight:`     | `bold` `normal`                      |
| `font-style:`      | `italic` `normal`                    |
| `text-decoration:` | `underline` `none`                   |
| ---                | ---                                  |
| `text-align:`      | `left` `right` `center` `justify`    |
| `text-transform:`  | `capitalize` `uppercase` `lowercase` |
{: .-key-values}

### 简写

|         | style    | weight | size (required) |     | line-height | family       |
| ------- | -------- | ------ | --------------- | --- | ----------- | ------------ |
| `font:` | `italic` | `400`  | `14px`          | `/` | `1.5`       | `sans-serif` |
|         | style    | weight | size *          |     | line-height | family *     |

### 示例

```css
font-family: Arial;
font-size: 12pt;
line-height: 1.5;
letter-spacing: 0.02em;
color: #aa3322;
```

### 大小写

```css
text-transform: capitalize; /* Hello */
text-transform: uppercase; /* HELLO */
text-transform: lowercase; /* hello */
```

## 背景
{column_size: 1}

### 属性值

| Property                 | Description                              |
| ------------------------ | ---------------------------------------- |
| `background:`            | _(简写)_                                 |
| ---                      | ---                                      |
| `background-color:`      | `<color>`                                |
| `background-image:`      | `url(...)`                               |
| `background-position:`   | `left/center/right` `top/center/bottom`  |
| `background-size:`       | `cover` `X Y`                            |
| `background-clip:`       | `border-box` `padding-box` `content-box` |
| `background-repeat:`     | `no-repeat` `repeat-x` `repeat-y`        |
| `background-attachment:` | `scroll` `fixed` `local`                 |

### 简写

|               | color  | image         | positionX | positionY |     | size           | repeat      | attachment |
| ------------- | ------ | ------------- | --------- | --------- | --- | -------------- | ----------- | ---------- |
| `background:` | `#ff0` | `url(bg.jpg)` | `left`    | `top`     | `/` | `100px` `auto` | `no-repeat` | `fixed;`   |
| `background:` | `#abc` | `url(bg.png)` | `center`  | `center`  | `/` | `cover`        | `repeat-x`  | `local;`   |
|               | color  | image         | positionX | positionY |     | size           | repeat      | attachment |

### 多种背景

```css
background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
  url('background.jpg') center center / cover, #333;
```

## 动画
{column_size: 1}

### 属性值

| Property                     | Value                                                    |
| ---------------------------- | -------------------------------------------------------- |
| `animation:`                 | _(shorthand)_                                            |
| `animation-name:`            | `<name>`                                                 |
| `animation-duration:`        | `<time>ms`                                               |
| `animation-timing-function:` | `ease` `linear` `ease-in` `ease-out` `ease-in-out`       |
| `animation-delay:`           | `<time>ms`                                               |
| `animation-iteration-count:` | `infinite` `<number>`                                    |
| `animation-direction:`       | `normal` `reverse` `alternate` `alternate-reverse`       |
| `animation-fill-mode:`       | `none` `forwards` `backwards` `both` `initial` `inherit` |
| `animation-play-state:`      | `normal` `reverse` `alternate` `alternate-reverse`       |

### 简写

|              | name     | duration | timing-function | delay   | count      | direction           | fill-mode | play-state |
| ------------ | -------- | -------- | --------------- | ------- | ---------- | ------------------- | --------- | ---------- |
| `animation:` | `bounce` | `300ms`  | `linear`        | `100ms` | `infinite` | `alternate-reverse` | `both`    | `reverse`  |
|              | name     | duration | timing-function | delay   | count      | direction           | fill-mode | play-state |
{: .-css-breakdown}

### 示例

```css
animation: bounce 300ms linear 0s infinite normal;
animation: bounce 300ms linear infinite;
animation: bounce 300ms linear infinite alternate-reverse;
animation: bounce 300ms linear 2s infinite alternate-reverse forwards normal;
```

### 事件

```js
.one('webkitAnimationEnd oanimationend msAnimationEnd animationend')
```