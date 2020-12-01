---
title: Awk
category: CLI
updated: 2020-09-04
column_size: 2
font_size: 12px
source:
    - [AWK 简明教程](https://coolshell.cn/articles/9070.html)
---

### 开始
#### 从netstat命令中提取了如下信息作为用例
```bash
$ cat netstat.txt
```
```markup
Proto Recv-Q Send-Q Local-Address          Foreign-Address             State
tcp        0      0 0.0.0.0:3306           0.0.0.0:*                   LISTEN
tcp        0      0 0.0.0.0:80             0.0.0.0:*                   LISTEN
tcp        0      0 127.0.0.1:9000         0.0.0.0:*                   LISTEN
tcp        0      0 coolshell.cn:80        124.205.5.146:18245         TIME_WAIT
tcp        0      0 coolshell.cn:80        61.140.101.185:37538        FIN_WAIT2
tcp        0      0 coolshell.cn:80        110.194.134.189:1032        ESTABLISHED
tcp        0      0 coolshell.cn:80        123.169.124.111:49809       ESTABLISHED
tcp        0      0 coolshell.cn:80        116.234.127.77:11502        FIN_WAIT2
tcp        0      0 coolshell.cn:80        123.169.124.111:49829       ESTABLISHED
tcp        0      0 coolshell.cn:80        183.60.215.36:36970         TIME_WAIT
tcp        0   4166 coolshell.cn:80        61.148.242.38:30901         ESTABLISHED
tcp        0      1 coolshell.cn:80        124.152.181.209:26825       FIN_WAIT1
tcp        0      0 coolshell.cn:80        110.194.134.189:4796        ESTABLISHED
tcp        0      0 coolshell.cn:80        183.60.212.163:51082        TIME_WAIT
tcp        0      1 coolshell.cn:80        208.115.113.92:50601        LAST_ACK
tcp        0      0 coolshell.cn:80        123.169.124.111:49840       ESTABLISHED
tcp        0      0 coolshell.cn:80        117.136.20.85:50025         FIN_WAIT2
tcp        0      0 :::22                  :::*                        LISTEN
```

### 第一个例子

其中单引号中的被**大括号**括着的就是`awk`的语句，注意，其只能被**单引号**包含。

其中的`$1..$n`表示第几例。注：`$0`表示整个行。

```bash
$ awk '{print $1, $4}' netstat.txt
```
```markup
Proto Local-Address
tcp 0.0.0.0:3306
tcp 0.0.0.0:80
tcp 127.0.0.1:9000
tcp coolshell.cn:80
tcp coolshell.cn:80
tcp coolshell.cn:80
tcp coolshell.cn:80
tcp coolshell.cn:80
tcp coolshell.cn:80
tcp coolshell.cn:80
tcp coolshell.cn:80
tcp coolshell.cn:80
tcp coolshell.cn:80
tcp coolshell.cn:80
tcp coolshell.cn:80
tcp coolshell.cn:80
tcp coolshell.cn:80
tcp :::22
```

### 格式化输出

`awk`的格式化输出，和`C`语言的`printf`没什么两样：
```bash
$ awk '{printf "%-8s %-8s %-8s %-18s %-22s %-15s\n",$1,$2,$3,$4,$5,$6}' netstat.txt
```
```markup
Proto    Recv-Q   Send-Q   Local-Address      Foreign-Address        State
tcp      0        0        0.0.0.0:3306       0.0.0.0:*              LISTEN
tcp      0        0        0.0.0.0:80         0.0.0.0:*              LISTEN
tcp      0        0        127.0.0.1:9000     0.0.0.0:*              LISTEN
tcp      0        0        coolshell.cn:80    124.205.5.146:18245    TIME_WAIT
tcp      0        0        coolshell.cn:80    61.140.101.185:37538   FIN_WAIT2
tcp      0        0        coolshell.cn:80    110.194.134.189:1032   ESTABLISHED
tcp      0        0        coolshell.cn:80    123.169.124.111:49809  ESTABLISHED
tcp      0        0        coolshell.cn:80    116.234.127.77:11502   FIN_WAIT2
tcp      0        0        coolshell.cn:80    123.169.124.111:49829  ESTABLISHED
tcp      0        0        coolshell.cn:80    183.60.215.36:36970    TIME_WAIT
tcp      0        4166     coolshell.cn:80    61.148.242.38:30901    ESTABLISHED
tcp      0        1        coolshell.cn:80    124.152.181.209:26825  FIN_WAIT1
tcp      0        0        coolshell.cn:80    110.194.134.189:4796   ESTABLISHED
tcp      0        0        coolshell.cn:80    183.60.212.163:51082   TIME_WAIT
tcp      0        1        coolshell.cn:80    208.115.113.92:50601   LAST_ACK
tcp      0        0        coolshell.cn:80    123.169.124.111:49840  ESTABLISHED
tcp      0        0        coolshell.cn:80    117.136.20.85:50025    FIN_WAIT2
tcp      0        0        :::22              :::*                   LISTEN
```

## 起步

### 过滤记录

#### 过滤条件为：**第3列**的值为`0` && **第6列**的值为`LISTEN`

```bash
$ awk '$3==0 && $6=="LISTEN" ' netstat.txt
```
```markup
tcp        0      0 0.0.0.0:3306               0.0.0.0:*              LISTEN
tcp        0      0 0.0.0.0:80                 0.0.0.0:*              LISTEN
tcp        0      0 127.0.0.1:9000             0.0.0.0:*              LISTEN
tcp        0      0 :::22                      :::*                   LISTEN
```
其中的`==`为比较运算符。其他比较运算符：`!=`, `>`, `<`, `>=`, `<=`

各种过滤记录的方式:
```bash
$ awk ' $3>0 {print $0}' netstat.txt
```
```markup
Proto Recv-Q Send-Q Local-Address          Foreign-Address             State
tcp        0   4166 coolshell.cn:80        61.148.242.38:30901         ESTABLISHED
tcp        0      1 coolshell.cn:80        124.152.181.209:26825       FIN_WAIT1
tcp        0      1 coolshell.cn:80        208.115.113.92:50601        LAST_ACK
```

如果需要表头的话，可以引入内建变量NR
```bash
$ awk '$3==0 && $6=="LISTEN" || NR==1 ' netstat.txt
```
```markup
Proto Recv-Q Send-Q Local-Address          Foreign-Address             State
tcp        0      0 0.0.0.0:3306           0.0.0.0:*                   LISTEN
tcp        0      0 0.0.0.0:80             0.0.0.0:*                   LISTEN
tcp        0      0 127.0.0.1:9000         0.0.0.0:*                   LISTEN
tcp        0      0 :::22                  :::*                        LISTEN
```

再加上格式化输出：
```bash
$ awk '$3==0 && $6=="LISTEN" || NR==1 {printf "%-20s %-20s %s\n",$4,$5,$6}' netstat.txt
```
```markup
Local-Address        Foreign-Address      State
0.0.0.0:3306         0.0.0.0:*            LISTEN
0.0.0.0:80           0.0.0.0:*            LISTEN
127.0.0.1:9000       0.0.0.0:*            LISTEN
:::22                :::*                 LISTEN
```

### 内建变量

| Code       | Description                                                                   |
| ---------- | ----------------------------------------------------------------------------- |
| `$0`       | 当前记录（这个变量中存放着整个行的内容）                                      |
| `$1~$n`    | 当前记录的第n个字段，字段间由FS分隔                                           |
| `FS`       | 输入字段分隔符 默认是空格或Tab                                                |
| `NF`       | 当前记录中的字段个数，就是有多少列                                            |
| `NR`       | 已经读出的记录数，就是行号，从1开始，<br>如果有多个文件话，这个值也是不断累加中。 |
| `FNR`      | 当前记录数，与NR不同的是，这个值会是各个文件自己的行号                        |
| `RS`       | 输入的记录分隔符， 默认为换行符                                               |
| `OFS`      | 输出字段分隔符， 默认也是空格                                                 |
| `ORS`      | 输出的记录分隔符，默认为换行符                                                |
| `FILENAME` | 当前输入文件的名字                                                            |

比如：我们如果要输出行号: 
```bash
$ awk '$3==0 && $6=="ESTABLISHED" || NR==1 {printf "%02s %s %-20s %-20s %s\n",NR, FNR, $4,$5,$6}' netstat.txt
```
```markup
01 1 Local-Address        Foreign-Address      State
07 7 coolshell.cn:80      110.194.134.189:1032 ESTABLISHED
08 8 coolshell.cn:80      123.169.124.111:49809 ESTABLISHED
10 10 coolshell.cn:80      123.169.124.111:49829 ESTABLISHED
14 14 coolshell.cn:80      110.194.134.189:4796 ESTABLISHED
17 17 coolshell.cn:80      123.169.124.111:49840 ESTABLISHED
```

### 指定分隔符

```bash
$  awk  'BEGIN{FS=":"} {print $1,$3,$6}' /etc/passwd
```
```markup
root 0 /root
bin 1 /bin
daemon 2 /sbin
adm 3 /var/adm
lp 4 /var/spool/lpd
sync 5 /sbin
shutdown 6 /sbin
halt 7 /sbin
```
上面的命令也等价于：（`-F`的意思就是指定分隔符）

```bash
$ awk  -F: '{print $1,$3,$6}' /etc/passwd
```

如果要指定多个分隔符，可以这样来：

```bash
awk -F '[;:]'
```

再来看一个以`\t`作为分隔符**输出**的例子（下面使用/etc/passwd文件，这个文件是以`:`分隔的）：
```bash
$ awk  -F: '{print $1,$3,$6}' OFS="\t" /etc/passwd
```
```markup
root    0       /root
bin     1       /bin
daemon  2       /sbin
adm     3       /var/adm
lp      4       /var/spool/lpd
sync    5       /sbin
```

## 进阶

### 字符串匹配
```bash
$ awk '$6 ~ /FIN/ || NR==1 {print NR,$4,$5,$6}' OFS="\t" netstat.txt
```
```markup
1       Local-Address   Foreign-Address State
6       coolshell.cn:80 61.140.101.185:37538    FIN_WAIT2
9       coolshell.cn:80 116.234.127.77:11502    FIN_WAIT2
13      coolshell.cn:80 124.152.181.209:26825   FIN_WAIT1
18      coolshell.cn:80 117.136.20.85:50025     FIN_WAIT2
```
```bash
$ $ awk '$6 ~ /WAIT/ || NR==1 {print NR,$4,$5,$6}' OFS="\t" netstat.txt
```
```markup
1       Local-Address   Foreign-Address State
5       coolshell.cn:80 124.205.5.146:18245     TIME_WAIT
6       coolshell.cn:80 61.140.101.185:37538    FIN_WAIT2
9       coolshell.cn:80 116.234.127.77:11502    FIN_WAIT2
11      coolshell.cn:80 183.60.215.36:36970     TIME_WAIT
13      coolshell.cn:80 124.152.181.209:26825   FIN_WAIT1
15      coolshell.cn:80 183.60.212.163:51082    TIME_WAIT
18      coolshell.cn:80 117.136.20.85:50025     FIN_WAIT2
```
上面的第一个示例匹配`FIN`状态， 第二个示例匹配`WAIT`字样的状态。其实`~`表示模式开始。`/ /`中是模式。这就是一个正则表达式的匹配。

`awk`可以像`grep`一样的去匹配单行：
```bash
$ awk '/LISTEN/' netstat.txt
```
```markup
tcp        0      0 0.0.0.0:3306            0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
tcp        0      0 127.0.0.1:9000          0.0.0.0:*               LISTEN
tcp        0      0 :::22                   :::*                    LISTEN
```

可以使用`/FIN|TIME/`来匹配`FIN`或者`TIME`:
```bash
$ awk '$6 ~ /FIN|TIME/ || NR==1 {print NR,$4,$5,$6}' OFS="\t" netstat.txt
```
```markup
1       Local-Address   Foreign-Address State
5       coolshell.cn:80 124.205.5.146:18245     TIME_WAIT
6       coolshell.cn:80 61.140.101.185:37538    FIN_WAIT2
9       coolshell.cn:80 116.234.127.77:11502    FIN_WAIT2
11      coolshell.cn:80 183.60.215.36:36970     TIME_WAIT
13      coolshell.cn:80 124.152.181.209:26825   FIN_WAIT1
15      coolshell.cn:80 183.60.212.163:51082    TIME_WAIT
18      coolshell.cn:80 117.136.20.85:50025     FIN_WAIT2
```

再来看看模式取反的例子：

```bash
$ awk '$6 !~ /WAIT/ || NR==1 {print NR,$4,$5,$6}' OFS="\t" netstat.txt
```
```markup
1       Local-Address   Foreign-Address State
2       0.0.0.0:3306    0.0.0.0:*       LISTEN
3       0.0.0.0:80      0.0.0.0:*       LISTEN
4       127.0.0.1:9000  0.0.0.0:*       LISTEN
7       coolshell.cn:80 110.194.134.189:1032    ESTABLISHED
8       coolshell.cn:80 123.169.124.111:49809   ESTABLISHED
10      coolshell.cn:80 123.169.124.111:49829   ESTABLISHED
12      coolshell.cn:80 61.148.242.38:30901     ESTABLISHED
14      coolshell.cn:80 110.194.134.189:4796    ESTABLISHED
16      coolshell.cn:80 208.115.113.92:50601    LAST_ACK
17      coolshell.cn:80 123.169.124.111:49840   ESTABLISHED
19      :::22   :::*    LISTEN
```

或者使用`awk '!/WAIT/' netstat.txt`进行全行的过滤。

### 折分文件

awk拆分文件很简单，使用重定向就好了。下面这个例子，是按第6列分隔文件（`group by`，不同值分到不同的文件中），相当的简单（其中的`NR!=1`表示不处理表头）。
```bash
$ awk 'NR!=1{print > $6}' netstat.txt
```
```bash
$ ls
```
```markup
ESTABLISHED  FIN_WAIT1  FIN_WAIT2  LAST_ACK  LISTEN  netstat.txt  TIME_WAIT
```

```bash
$ cat ESTABLISHED
```
```markup
tcp        0      0 coolshell.cn:80        110.194.134.189:1032        ESTABLISHED
tcp        0      0 coolshell.cn:80        123.169.124.111:49809       ESTABLISHED
tcp        0      0 coolshell.cn:80        123.169.124.111:49829       ESTABLISHED
tcp        0   4166 coolshell.cn:80        61.148.242.38:30901         ESTABLISHED
tcp        0      0 coolshell.cn:80        110.194.134.189:4796        ESTABLISHED
tcp        0      0 coolshell.cn:80        123.169.124.111:49840       ESTABLISHED
```

```bash
$ cat FIN_WAIT1
```
```markup
tcp        0      1 coolshell.cn:80        124.152.181.209:26825       FIN_WAIT1
```

```bash
$ cat FIN_WAIT2
```
```markup
tcp        0      0 coolshell.cn:80        61.140.101.185:37538        FIN_WAIT2
tcp        0      0 coolshell.cn:80        116.234.127.77:11502        FIN_WAIT2
tcp        0      0 coolshell.cn:80        117.136.20.85:50025         FIN_WAIT2
```

```bash
$ cat LAST_ACK
```
```markup
tcp        0      1 coolshell.cn:80        208.115.113.92:50601        LAST_ACK
```

```bash
$ cat LISTEN
```
```markup
tcp        0      0 0.0.0.0:3306           0.0.0.0:*                   LISTEN
tcp        0      0 0.0.0.0:80             0.0.0.0:*                   LISTEN
tcp        0      0 127.0.0.1:9000         0.0.0.0:*                   LISTEN
tcp        0      0 :::22                  :::*                        LISTEN
```

```bash
$ cat TIME_WAIT
```
```markup
tcp        0      0 coolshell.cn:80        124.205.5.146:18245         TIME_WAIT
tcp        0      0 coolshell.cn:80        183.60.215.36:36970         TIME_WAIT
tcp        0      0 coolshell.cn:80        183.60.212.163:51082        TIME_WAIT
```

也可以只将指定的列输出到文件：

```bash
awk 'NR!=1{print $4,$5 > $6}' netstat.txt
```

再复杂一点：（注意其中的`if-else-if`语句，可见awk其实是个脚本解释器）

```bash
$ awk 'NR!=1{if($6 ~ /TIME|ESTABLISHED/) print > "1.txt";
else if($6 ~ /LISTEN/) print > "2.txt";
else print > "3.txt" }' netstat.txt
```

```bash
$ ls *.txt
```
```markup
1.txt  2.txt  3.txt
```

```bash
$ cat 1.txt
```
```markup
tcp        0      0 coolshell.cn:80        124.205.5.146:18245         TIME_WAIT
tcp        0      0 coolshell.cn:80        110.194.134.189:1032        ESTABLISHED
tcp        0      0 coolshell.cn:80        123.169.124.111:49809       ESTABLISHED
tcp        0      0 coolshell.cn:80        123.169.124.111:49829       ESTABLISHED
tcp        0      0 coolshell.cn:80        183.60.215.36:36970         TIME_WAIT
tcp        0   4166 coolshell.cn:80        61.148.242.38:30901         ESTABLISHED
tcp        0      0 coolshell.cn:80        110.194.134.189:4796        ESTABLISHED
tcp        0      0 coolshell.cn:80        183.60.212.163:51082        TIME_WAIT
tcp        0      0 coolshell.cn:80        123.169.124.111:49840       ESTABLISHED
```

```bash
$ cat 2.txt
```
```markup
tcp        0      0 0.0.0.0:3306           0.0.0.0:*                   LISTEN
tcp        0      0 0.0.0.0:80             0.0.0.0:*                   LISTEN
tcp        0      0 127.0.0.1:9000         0.0.0.0:*                   LISTEN
tcp        0      0 :::22                  :::*                        LISTEN
```

```bash
$ cat 3.txt
```
```markup
tcp        0      0 coolshell.cn:80        61.140.101.185:37538        FIN_WAIT2
tcp        0      0 coolshell.cn:80        116.234.127.77:11502        FIN_WAIT2
tcp        0      1 coolshell.cn:80        124.152.181.209:26825       FIN_WAIT1
tcp        0      1 coolshell.cn:80        208.115.113.92:50601        LAST_ACK
tcp        0      0 coolshell.cn:80        117.136.20.85:50025         FIN_WAIT2
```

### 统计

下面的命令计算所有的C文件，CPP文件和H文件的文件大小总和。

```bash
$ ls -l  *.cpp *.c *.h | awk '{sum+=$5} END {print sum}'
```
```markup
2511401
```

我们再来看一个统计各个connection状态的用法：（我们可以看到一些编程的影子了，大家都是程序员我就不解释了。注意其中的**数组**的用法）

```bash
$ awk 'NR!=1{a[$6]++;} END {for (i in a) print i ", " a[i];}' netstat.txt
```
```markup
TIME_WAIT, 3
FIN_WAIT1, 1
ESTABLISHED, 6
FIN_WAIT2, 3
LAST_ACK, 1
LISTEN, 4
```

再来看看统计每个用户的进程的占了多少内存（注：sum的RSS那一列）

```bash
$ ps aux | awk 'NR!=1{a[$1]+=$6;} END { for(i in a) print i ", " a[i]"KB";}'
```
```markup
dbus, 540KB
mysql, 99928KB
www, 3264924KB
root, 63644KB
hchen, 6020KB
```

## 深入

### awk脚本

#### 运行前
```bash
BEGIN { 这里面放的是执行前的语句 }
```
#### 运行中
```bash
{ 这里面放的是处理每一行时要执行的语句 }
```
#### 运行后
```bash
END {这里面放的是处理完所有的行后要执行的语句 }
```
#### 案例

假设有这么一个文件（学生成绩表）：

```bash
$ cat score.txt
```
```markup
Marry   2143 78 84 77
Jack    2321 66 78 45
Tom     2122 48 77 71
Mike    2537 87 97 95
Bob     2415 40 57 62
```

我们的awk脚本如下（我没有写有命令行上是因为命令行上不易读，另外也在介绍另一种用法）：

```bash
$ cat cal.awk
```
```bash
#!/bin/awk -f
#运行前
BEGIN {
    math = 0
    english = 0
    computer = 0

    printf "NAME    NO.   MATH  ENGLISH  COMPUTER   TOTAL\n"
    printf "---------------------------------------------\n"
}
#运行中
{
    math+=$3
    english+=$4
    computer+=$5
    printf "%-6s %-6s %4d %8d %8d %8d\n", $1, $2, $3,$4,$5, $3+$4+$5
}
#运行后
END {
    printf "---------------------------------------------\n"
    printf "  TOTAL:%10d %8d %8d \n", math, english, computer
    printf "AVERAGE:%10.2f %8.2f %8.2f\n", math/NR, english/NR, computer/NR
}
```

我们来看一下执行结果：（也可以这样运行 `./cal.awk score.txt`）

```bash
$ awk -f cal.awk score.txt
```
```markup
NAME    NO.   MATH  ENGLISH  COMPUTER   TOTAL
---------------------------------------------
Marry  2143     78       84       77      239
Jack   2321     66       78       45      189
Tom    2122     48       77       71      196
Mike   2537     87       97       95      279
Bob    2415     40       57       62      159
---------------------------------------------
  TOTAL:       319      393      350
AVERAGE:     63.80    78.60    70.00
```

### 环境变量

即然说到了脚本，我们来看看怎么和环境变量交互：（使用`-v`参数和`ENVIRON`，使用`ENVIRON`的环境变量需要`export`）

```bash
$ x=5
$ y=10
$ export y
$ echo $x $y
```
```markup
5 10
```

```bash
$ awk -v val=$x '{print $1, $2, $3, $4+val, $5+ENVIRON["y"]}' OFS="\t" score.txt
```
```markup
Marry   2143    78      89      87
Jack    2321    66      83      55
Tom     2122    48      82      81
Mike    2537    87      102     105
Bob     2415    40      62      72
```

### 几个小例子
```bash
#从file文件中找出长度大于80的行
awk 'length>80' file

#按连接数查看客户端IP
netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -nr

#打印99乘法表
seq 9 | sed 'H;g' | awk -v RS='' '{for(i=1;i<=NF;i++)printf("%dx%d=%d%s", i, NR, i*NR, i==NR?"\n":"\t")}' 
```




