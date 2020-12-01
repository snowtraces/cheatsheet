---
title: Bash scripting
category: CLI
updated: 2020-07-05
---

### 示例

```bash
#!/usr/bin/env bash

NAME="John"
echo "Hello $NAME!"
```

### 变量

```bash
NAME="John"
echo $NAME
echo "$NAME"
echo "${NAME}!"
```

### 字符串引号

```bash
NAME="John"
echo "Hi $NAME"  #=> Hi John
echo 'Hi $NAME'  #=> Hi $NAME
```

### Shell执行

```bash
echo "I'm in $(pwd)"
echo "I'm in `pwd`"
# Same
```

更多 [Command substitution](http://wiki.bash-hackers.org/syntax/expansion/cmdsubst)

### 条件执行

```bash
git commit && git push
git commit || echo "Commit failed"
```

### 函数

```bash
get_name() {
  echo "John"
}

echo "You are $(get_name)"
```

更多: [Functions](#函数)

### 条件判断

```bash
if [[ -z "$string" ]]; then
  echo "String is empty"
elif [[ -n "$string" ]]; then
  echo "String is not empty"
fi
```

更多: [Conditionals](#条件分支)

### Strict 模式

```bash
set -euo pipefail
IFS=$'\n\t'
```

更多: [Unofficial bash strict mode](http://redsymbol.net/articles/unofficial-bash-strict-mode/)

### 花括号展开

```bash
echo {A,B}.js
```

| Expression | Description         |
| ---------- | ------------------- |
| `{A,B}`    | Same as `A B`       |
| `{A,B}.js` | Same as `A.js B.js` |
| `{1..5}`   | Same as `1 2 3 4 5` |

更多: [Brace expansion](http://wiki.bash-hackers.org/syntax/expansion/brace)


## 参数扩展


### 基本使用

```bash
name="John"
echo ${name}
echo ${name/J/j}    #=> "john" (替换)
echo ${name:0:2}    #=> "Jo" (切片)
echo ${name::2}     #=> "Jo" (切片)
echo ${name::-1}    #=> "Joh" (切片)
echo ${name:(-1)}   #=> "n" (右侧开始切片)
echo ${name:(-2):1} #=> "h" (右侧开始切片)
echo ${food:-Cake}  #=> $food or "Cake"
```

```bash
length=2
echo ${name:0:length}  #=> "Jo"
```

更多: [Parameter expansion](http://wiki.bash-hackers.org/syntax/pe)

```bash
STR="/path/to/foo.cpp"
echo ${STR%.cpp}    # /path/to/foo
echo ${STR%.cpp}.o  # /path/to/foo.o
echo ${STR%/*}      # /path/to
echo ${STR%%/*}     # (空)

echo ${STR##*.}     # cpp (extension)
echo ${STR##*/}     # foo.cpp (basepath)

echo ${STR#*/}      # path/to/foo.cpp
echo ${STR##*/}     # foo.cpp

echo ${STR/foo/bar} # /path/to/bar.cpp
```

```bash
STR="Hello world"
echo ${STR:6:5}    # "world"
echo ${STR: -5:5}  # "world"
```

```bash
SRC="/path/to/foo.cpp"
BASE=${SRC##*/}   #=> "foo.cpp" (basepath)
DIR=${SRC%$BASE}  #=> "/path/to/" (dirpath)
```

### 替换

`%rule`删除`rule`到结束匹配的内容，`#rule`删除开始到`rule`匹配的内容，即`%`删除后缀、`#`删除前缀。
另外，默认为最小匹配，叠字`%%`、`##`为贪婪匹配。

| Code              | Description      |
| ----------------- | ---------------- |
| `${FOO%suffix}`   | 删除后缀         |
| `${FOO#prefix}`   | 删除前缀         |
| ---               | ---              |
| `${FOO%%suffix}`  | 删除最大匹配后缀 |
| `${FOO##prefix}`  | 删除最大匹配前缀 |
| ---               | ---              |
| `${FOO/from/to}`  | 替换第一各匹配项 |
| `${FOO//from/to}` | 替换所有匹配项   |
| ---               | ---              |
| `${FOO/%from/to}` | 替换前缀         |
| `${FOO/#from/to}` | 替换后缀         |

### 注释

```bash
# Single line comment
```

```bash
: '
This is a
multi line
comment
'
```

### 子串

| Expression      | Description                    |
| --------------- | ------------------------------ |
| `${FOO:0:3}`    | Substring _(position, length)_ |
| `${FOO:(-3):3}` | Substring from the right       |

### 长度

| Expression | Description      |
| ---------- | ---------------- |
| `${#FOO}`  | Length of `$FOO` |

### 操作

```bash
STR="HELLO WORLD!"
echo ${STR,}   #=> "hELLO WORLD!" (首字母小写)
echo ${STR,,}  #=> "hello world!" (全部小写)

STR="hello world!"
echo ${STR^}   #=> "Hello world!" (首字母大写)
echo ${STR^^}  #=> "HELLO WORLD!" (全部大写)
```

### 默认值

| Expression        | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `${FOO:-val}`     | `$FOO`, or `val` if unset (or null)                      |
| `${FOO:=val}`     | Set `$FOO` to `val` if unset (or null)                   |
| `${FOO:+val}`     | `val` if `$FOO` is set (and not null)                    |
| `${FOO:?message}` | Show error message and exit if `$FOO` is unset (or null) |

Omitting the `:` removes the (non)nullity checks, e.g. `${FOO-val}` expands to `val` if unset otherwise `$FOO`.

## 循环

### 基本循环

```bash
for i in /etc/rc*; do
  echo $i
done
```

### C-like 循环

```bash
for ((i = 0 ; i < 100 ; i++)); do
  echo $i
done
```

### 范围

```bash
for i in {1..5}; do
    echo "Welcome $i"
done
```

#### 带步长的范围

```bash
for i in {5..50..5}; do
    echo "Welcome $i"
done
```

### 读取行

```bash
cat file.txt | while read line; do
  echo $line
done
```

### 死循环

```bash
while true; do
  ···
done
```

## 函数

### 定义函数

```bash
myfunc() {
    echo "hello $1"
}
```

```bash
# Same as above (alternate syntax)
function myfunc() {
    echo "hello $1"
}
```

```bash
myfunc "John"
```

### 返回值

```bash
myfunc() {
    local myresult='some value'
    echo $myresult
}
```

```bash
result="$(myfunc)"
```

### 引发错误

```bash
myfunc() {
  return 1
}
```

```bash
if myfunc; then
  echo "success"
else
  echo "failure"
fi
```

### 参数

| Expression | Description              |
| ---------- | ------------------------ |
| `$#`       | 参数个数                 |
| `$*`       | 所有参数                 |
| `$@`       | 所有参数，从第一个开始   |
| `$1`       | 第一个参数               |
| `$_`       | 上一个命令的最后一个参数 |

更多 [Special parameters](http://wiki.bash-hackers.org/syntax/shellvars#special_parameters_and_shell_variables).

## 条件语句

### 条件

`[[`会返回`0`(假)或`1`(真)，其他任意遵守相同逻辑的程序均可以作为条件，详见示例。


| Condition                | Description |
| ------------------------ | ----------- |
| `[[ -z STRING ]]`        | 字符串为空  |
| `[[ -n STRING ]]`        | 字符串非空  |
| `[[ STRING == STRING ]]` | 字符串相等  |
| `[[ STRING != STRING ]]` | 字符串不等  |
| ---                      | ---         |
| `[[ NUM -eq NUM ]]`      | 相等        |
| `[[ NUM -ne NUM ]]`      | 不等        |
| `[[ NUM -lt NUM ]]`      | 小于        |
| `[[ NUM -le NUM ]]`      | 小于等于    |
| `[[ NUM -gt NUM ]]`      | 大于        |
| `[[ NUM -ge NUM ]]`      | 大于等于    |
| ---                      | ---         |
| `[[ STRING =~ REGEXP ]]` | 正则匹配    |
| ---                      | ---         |
| `(( NUM < NUM ))`        | 数值条件    |

#### 更多条件

| Condition                           | Description      |
| ----------------------------------- | ---------------- |
| `[[ -o noclobber ]]`                | 如果*xx设置*开启 |
| ---                                 | ---              |
| `[[ ! EXPR ]]`                      | 非               |
| `[[ X && Y ]]`                      | 与               |
| <code>[[ X &#124;&#124; Y ]]</code> | 或               |

### 文件条件

| Condition               | Description              |
| ----------------------- | ------------------------ |
| `[[ -e FILE ]]`         | 存在                     |
| `[[ -r FILE ]]`         | 可读                     |
| `[[ -h FILE ]]`         | 符号链接                 |
| `[[ -d FILE ]]`         | 目录                     |
| `[[ -w FILE ]]`         | 可写                     |
| `[[ -s FILE ]]`         | 文件大小大于0            |
| `[[ -f FILE ]]`         | 普通文件                 |
| `[[ -x FILE ]]`         | 可执行                   |
| ---                     | ---                      |
| `[[ FILE1 -nt FILE2 ]]` | 1比2更新，或1存在2不存在 |
| `[[ FILE1 -ot FILE2 ]]` | 1比2更旧，或2存在1不存在 |
| `[[ FILE1 -ef FILE2 ]]` | 相同文件                 |

### 示例

#### 字符串
```bash
if [[ -z "$string" ]]; then
  echo "String为空"
elif [[ -n "$string" ]]; then
  echo "String非空"
else
  echo "此处不可达"
fi
```

#### 组合
```bash
if [[ X && Y ]]; then
  ...
fi
```

#### 相等
```bash
if [[ "$A" == "$B" ]]
```

#### 正则
```bash
if [[ "A" =~ . ]]
```

#### 数值
```bash
if (( $a < $b )); then
   echo "$a比$b小"
fi
```

#### 文件
```bash
if [[ -e "file.txt" ]]; then
  echo "文件存在"
fi
```

## 数组

### 定义数组

```bash
Fruits=('Apple' 'Banana' 'Orange')
```

```bash
Fruits[0]="Apple"
Fruits[1]="Banana"
Fruits[2]="Orange"
```

### 数组使用

```bash
echo ${Fruits[0]}           # 第一个元素 #0
echo ${Fruits[-1]}          # 最后一个元素
echo ${Fruits[@]}           # 所有元素，空格隔开
echo ${#Fruits[@]}          # 元素个数
echo ${#Fruits}             # 第一个元素长度
echo ${#Fruits[3]}          # 第n个元素长度  
echo ${Fruits[@]:3:2}       # 范围 (3开始，长度2)
echo ${!Fruits[@]}          # 所有元素的键，空格隔开
```

### 操作

```bash
Fruits=("${Fruits[@]}" "Watermelon")    # Push
Fruits+=('Watermelon')                  # Also Push
Fruits=( ${Fruits[@]/Ap*/} )            # 按正则匹配移除
unset Fruits[2]                         # 删除指定元素
Fruits=("${Fruits[@]}" "${Veggies[@]}") # 合并
lines=(`cat "logfile"`)                 # 从文件中读取
```

### 变量

```bash
for i in "${arrayName[@]}"; do
  echo $i
done
```

## 字典

### 定义

```bash
declare -A sounds
```

```bash
sounds[dog]="bark"
sounds[cow]="moo"
sounds[bird]="tweet"
sounds[wolf]="howl"
```

### 字典使用

```bash
echo ${sounds[dog]} # 按key取值
echo ${sounds[@]}   # 所有值
echo ${!sounds[@]}  # 所有键
echo ${#sounds[@]}  # 长度
unset sounds[dog]   # 按key移除
```

### 遍历

#### 值遍历

```bash
for val in "${sounds[@]}"; do
  echo $val
done
```

#### 键遍历

```bash
for key in "${!sounds[@]}"; do
  echo $key
done
```

## 选项

### 选项

```bash
set -o noclobber  # 避免覆盖文件 (echo "hi" > foo)
set -o errexit    # 用于在出错时退出，避免级联错误
set -o pipefail   # 显示隐藏的错误
set -o nounset    # 
```

### 扩展选项

```bash
shopt -s nullglob    # 移除不匹配扩展项 ('*.foo' => '')
shopt -s failglob    # 无匹配扩展时直接报错
shopt -s nocaseglob  # 扩展大小写不敏感
shopt -s dotglob     # 通配符匹配点文件 ("*.sh" => ".foo.sh")
shopt -s globstar    # **匹配零个或多个子目录 ('lib/**/*.rb' => 'lib/a/b/c.rb')
```

## 历史

### 命令

| Command               | Description          |
| --------------------- | -------------------- |
| `history`             | 查看历史             |
| `shopt -s histverify` | 不要立即执行扩展结果 |

### 表达式

| Expression   | Description                   |
| ------------ | ----------------------------- |
| `!$`         | 展开最新命令的最后一个参数    |
| `!*`         | 展开最新命令的所有参数        |
| `!-n`        | 展开第 `n`个最近参数          |
| `!n`         | 展开第 `n`个参数              |
| `!<command>` | 展开命令`<command>`的最新调用 |

### 操作

| Code                 | Description                                    |
| -------------------- | ---------------------------------------------- |
| `!!`                 | 再次执行上一条命令                             |
| `!!:s/<FROM>/<TO>/`  | 在最新命令中将第一次出现的`<FROM>`替换为`<TO>` |
| `!!:gs/<FROM>/<TO>/` | 在最新命令中将所有的`<FROM>`替换为`<TO>`       |
| `!$:t`               | 仅从最近命令的最后一个参数扩展基本称           |
| `!$:h`               | 仅从最近命令的最后一个参数扩展目录             |

`!!`和`!$`可以替换为任何有效的扩展。

### 切分

| Code     | Description                                             |
| -------- | ------------------------------------------------------- |
| `!!:n`   | 展开最新命令的第`n`个指令  （`0`是命令;`1`是第一个参数) |
| `!^`     | 展开最新命令中的第一个参数                              |
| `!$`     | 展开最新命令的最后一个指令                              |
| `!!:n-m` | 展开最新命令的指定范围的指令                            |
| `!!:n-$` | 展开最新命令的第`n`到最后一个指令                       |

`!!` 可以替换为任何有效的扩展， `!cat`, `!-2`, `!42`, etc.

## 杂项

### 数值计算

```bash
$((a + 200))      # $a加上200
```

```bash
$(($RANDOM%200))  # 0..199间的随机数
```

### 子脚本

```bash
(cd somedir; echo "I'm now in $PWD")
pwd # 还在最初的目录中
```

### 重定向

```bash
python hello.py > output.txt   # 标准输出到（文件）
python hello.py >> output.txt  # 标准输出到（文件），追加
python hello.py 2> error.log   # 标准错误输出到（文件）
python hello.py 2>&1           # 标准错误输出到 标准输出
python hello.py 2>/dev/null    # 标准错误输出到（null）
python hello.py &>/dev/null    # 标准输出和标准错误输出到（null）
```

```bash
python hello.py < foo.txt      # 将 foo.txt 标准输入到 python
```

### 检查命令

```bash
command -V cd
#=> "cd is a shell builtin"
```

### 捕获错误

```bash
trap 'echo Error at about $LINENO' ERR
```

or

```bash
traperr() {
  echo "ERROR: ${BASH_SOURCE[1]} at about ${BASH_LINENO[0]}"
}

set -o errtrace
trap traperr ERR
```

### Case/switch

```bash
case "$1" in
  start | up)
    vagrant up
    ;;

  *)
    echo "Usage: $0 {start|stop|ssh}"
    ;;
esac
```

### Source relative

```bash
source "${0%/*}/../share/foo.sh"
```

### printf

```bash
printf "Hello %s, I'm %s" Sven Olga
#=> "Hello Sven, I'm Olga

printf "1 + 1 = %d" 2
#=> "1 + 1 = 2"

printf "This is how you print a float: %f" 2
#=> "This is how you print a float: 2.000000"
```

### Directory of script

```bash
DIR="${0%/*}"
```

### 获取选项

```bash
while [[ "$1" =~ ^- && ! "$1" == "--" ]]; do case $1 in
  -V | --version )
    echo $version
    exit
    ;;
  -s | --string )
    shift; string=$1
    ;;
  -f | --flag )
    flag=1
    ;;
esac; shift; done
if [[ "$1" == '--' ]]; then shift; fi
```

### Heredoc

```sh
cat <<END
hello world
END
```

### 读取输入

```bash
echo -n "Proceed? [y/n]: "
read ans
echo $ans
```

```bash
read -n 1 ans    # Just one character
```

### 特殊变量

| Expression | Description          |
| ---------- | -------------------- |
| `$?`       | 上一个任务的退出状态 |
| `$!`       | 上一个后台任务的PID  |
| `$$`       | shell的PID           |
| `$0`       | Shell脚本的文件名    |

更多 [特殊变量](http://wiki.bash-hackers.org/syntax/shellvars#special_parameters_and_shell_variables).

### 返回先前目录


```bash
cd -
```

### 命令结果检查

```bash
if ping -c 1 google.com; then
  echo "It appears you have a working internet connection"
fi
```

### GREP结果检查

```bash
if grep -q 'foo' ~/.bash_history; then
  echo "You appear to have typed 'foo' in the past"
fi
```


## 更多

 - [Bash-hackers wiki](http://wiki.bash-hackers.org/) _(bash-hackers.org)_
 - [Shell vars](http://wiki.bash-hackers.org/syntax/shellvars) _(bash-hackers.org)_
 - [Learn bash in y minutes](https://learnxinyminutes.com/docs/bash/) _(learnxinyminutes.com)_
 - [Bash Guide](http://mywiki.wooledge.org/BashGuide) _(mywiki.wooledge.org)_
 - [ShellCheck](https://www.shellcheck.net/) _(shellcheck.net)_


