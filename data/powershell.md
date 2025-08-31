---
title: Powershell
category: CLI
updated: 2020-07-05
column_size: 2
---

### 帮助

```shell
Get-Help alias
Show-Command Get-Help
Get-Command Get-*
Get-Alias -name l*
Get-Alias -definition Get-Alias
```

### 文件和路径

```shell
Get-ChildItem [path]; ls; dir       # 子对象列表
(dir -Recurse).Name                 # 递归列出文件名
(dir -Recurse).FullName             # 递归列出完整路径
Get-Location; $pwd; $pwd.Path       # 显示当前位置（非UNC路径）
$pwd.ProviderPath                   # 显示当前位置（UNC路径）
Set-Location path                   # 更改当前位置
Resolve-Path path                   # 绝对路径
(Get-Item filespec).Name            # 文件名
(Get-Item filespec).DirectoryName   # 所在文件夹名
(Get-Item filespec).Parent          # 所在文件夹名
($pwd[0].Path).split("\")[-2]       # 上级目录名
```

`UNC`（Universal Naming Convention），类似`\\softer`这样的形式的网络路径

### 句法要素

| Element                                  | Action           |
| ---------------------------------------- | ---------------- |
| # 这是评论                               | 单行评论         |
| <# ... #>                                | 多行评论         |
| <code>`</code>结尾                       | 连续多行执行命令 |
| `;`分割                                  | 单行多个命令     |
| <code>`</code>                           | 转义字符         |
| <code>&#96;n</code>, <code>&#96;t</code> | 不可打印的字符   |

#### 三元运算

```shell
boolExpr ? "a" : "b"

switch(boolExpr) {
    $true { $x }
    $false { $y }
}

if(boolExpr) {$x} else {$y}
```

### 显示选项

| Command                              | Action                   |
| ------------------------------------ | ------------------------ |
| <code>any &#124; Format-List</code>  | list 化列表              |
| <code>any &#124; Format-Table</code> | table 化列表             |
| <code>any &#124; Out-GridView</code> | table 化列表，交互式界面 |

#### 格式化 + 过滤

```shell
# table化输出到文件
any | Format-Table -AutoSize | Out-File file -Encoding ascii

# table化输出到文件
any | Format-Table -AutoSize | Out-String | Set-Content file

# 格式化 + 过滤
any | Format-Table -AutoSize | Out-String -Stream | ForEach { $_.TrimEnd() } |where { $PSItem } | Set-Content file

# alias 实例
ps | ft -auto| Out-String -Stream | %{ $_.TrimEnd() } | ? { $_ } | sc file
```

### 提示和暂停

| Command                    | Action              |
| -------------------------- | ------------------- |
| `Read-Host prompt`         | 输入提示            |
| `Start-Sleep seconds`      | 暂停特定时长        |
| `Read-Host -Prompt prompt` | 暂停等待 Enter 继续 |
| `Clear-Host`               | 清屏                |

## 语法

### 变量

```shell
$a = 25; $a                                 #=> 25
42 | sv a; $a                               #=> 42
[ValidateRange(1,10)][int]$x = 1; $x = 22   #=> _error_

$a = 25; '$a not interpolated'              #=> $a not interpolated
$a = 25; "$a interpolated"                  #=> $a interpolated

$arr = "aaa","bbb","x"; $arr                #=> aaa bbb x
$OFS='/'; "arr is [$arr]"                   #=> arr is [aaa/bbb/x]

ls | % { $_.name }                          # $_ 为循环变量
```

### 特殊缩写

| 缩写    | 完整形式         | 用途                                           |
| ------- | ---------------- | ---------------------------------------------- |
| `%`     | `ForEach-Object` | 对集合中的每个对象执行操作                     |
| `?`     | `Where-Object`   | 过滤集合中的对象，类似于 SQL 中的 WHERE 子句   |
| `$_`    | -                | 表示当前正在处理的对象（管道中的当前对象）     |
| `$args` | -                | 表示脚本或函数的参数集合                       |
| `$PID`  | -                | 表示当前 PowerShell 会话的进程 ID              |
| `$?`    | -                | 表示上一个命令的执行结果，用于检查命令是否成功 |

```shell
# % (ForEach-Object)
1..5 | % { $_ * 2 }

# ? (Where-Object)
Get-ChildItem | ? { $_.Extension -eq '.txt' }

# $_ (Current Object)
Get-Service | % { Write-Host "服务名称: $($_.DisplayName)" }

# $args (Script or Function Parameters)
function My-Function { param($param1, $param2) }
My-Function -param1 "值1" -param2 "值2"

function My-Function {
    foreach ($arg in $args) {
        Write-Host "参数值: $arg"
    }
}
My-Function "值1" "值2" "值3"

# $PID (Current PowerShell Session Process ID)
Write-Host "当前进程ID: $PID"

# $? (Last Command Execution Result)
Get-Process NonExistentProcess
if ($?) { Write-Host "进程找到." }
```

### 参数传递

```shell
function func($a,$b) {
    "{0}/{1}" -f $a.length, $b.length
}

func 5 3                 # 空格传递多个参数
$a = 5, 3; func @a       # 数组传递多个参数
func 2,3 4               # 数组作为单个参数传递
'/tmp' | dir             # 管道符传参
```

**单引号**纯文本输出，**双引号**会解析其中变量

### 属性

```shell
gm -input (1..5) -name count                  # 尝试获取属性

ps | ? { $_.VM -gt 100MB }                    # 默认属性
ps | ? { $_.VM -gt 100MB } | select name, vm  # 指定属性
ps | ? { $_.Name -match "^m"} | ft            # table
ps | ? { $_.Name -match "^m"} | fl            # list
$PWD | ConvertTo-Json -Depth 1                # toJSON
```

### 对象、类型和转型

```shell
@(Get-Process).Count                           # 集合大小
(1,2,3).GetType().FullName                     # 对象类型
ps | gm | select -First 1 | % { $_.TypeName }  # 集合中对象类型
"hello" -is [string]                           # 类型判断
"35.2" -as [int]                               # 转型
[char]48                                       # ASCII码转字符
[byte][char] "A"                               # 字符转ASCII码
"0x{0:x}" -f 64                                # integer转16进制
$newObj = $oldObj | select *                   # 拷贝对象
$newObj = $oldObj | select * -except property  # 拷贝对象并排除
```

### 服务、进程操作

```shell
Get-Service -Name $name | Start-Service -PassThru  # 启动服务
Get-Process -Name PowerShell                       # 获取进程信息
Get-Process -Name PowerShell | Get-Member          # 获取进程更多属性
```

### 比较运算

| OP           | desc                       |
| ------------ | -------------------------- |
| -eq          | 等于                       |
| -ne          | 不等于                     |
| -gt          | 大于                       |
| -ge          | 大于或等于                 |
| -lt          | 小于                       |
| -le          | 小于或等于                 |
| -Like        | 使用 \* 通配符进行匹配     |
| -NotLike     | 不使用 \* 通配符进行匹配   |
| -Match       | 匹配指定的正则表达式       |
| -NotMatch    | 不匹配指定的正则表达式     |
| -Contains    | 确定集合中是否包含指定的值 |
| -NotContains | 确定集合是否不包含特定值   |
| -In          | 确定指定的值是否在集合中   |
| -NotIn       | 确定指定的值是否不在集合中 |
| -Replace     | 替换指定的值               |

表中列出的所有运算符都不区分大小写。 将 `c` 放置在运算符之前，使其区分大小写。 例如，`-ceq` 是区分大小写的 `-eq` 比较运算符。

```shell
Get-Service | Where-Object Name -eq w32time
```

## 常用示例

#### 日志相关
```shell
Get-Content -Path "C:\Path\To\LogFile.txt" -Encoding UTF8 -Tail 10 -Wait

# -Tail 10 表示只查看最后10行
# -Wait 为监听实时日志，类似bash的tail -10f
```

```shell
# 查找Error关键字的日志
Select-String -Path "C:\Path\To\LogFile.txt" -Pattern "Error"

# 查找多个关键字
Select-String -Path "C:\Path\To\LogFile.txt" -Pattern @("Error", "Warning")

Select-String -Path "C:\Path\To\LogFile.txt" -Pattern "Error|Warning" # 正则表达式匹配

# 查找指定条件的行
Get-Content -Path "C:\Path\To\LogFile.txt" | Where-Object { $_ -match "Error" -and $_ -match "2024-01-10" }
```