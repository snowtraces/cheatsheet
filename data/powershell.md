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
switch(boolExpr) {
    $true { $x } 
    $false { $y }
}
    
if(boolExpr) {$x} else {$y}
```

### 显示选项

| Command                              | Action                  |
| ------------------------------------ | ----------------------- |
| <code>any &#124; Format-List</code>  | list化列表              |
| <code>any &#124; Format-Table</code> | table化列表             |
| <code>any &#124; Out-GridView</code> | table化列表，交互式界面 |

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

| Command                    | Action            |
| -------------------------- | ----------------- |
| `Read-Host prompt`         | 输入提示          |
| `Start-Sleep seconds`      | 暂停特定时长      |
| `Read-Host -Prompt prompt` | 暂停等待Enter继续 |
| `Clear-Host`               | 清屏              |


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
