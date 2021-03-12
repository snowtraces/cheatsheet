---
title: cmd
category: CLI
updated: 2021-03-12
column_size: 3
from: https://cheatography.com/chaosjd/cheat-sheets/batch/
---

### 帮助
| code                | desc             |
| ------------------- | ---------------- |
| `help`              | 查看所有命令     |
| `help` comman­dName | 查看指定命令帮助 |
| comman­dName `/?`   | 查看指定命令帮助 |

### 定位
| code            | desc             |
| --------------- | ---------------- |
| `cd ..`，`cd..` | 相对路径，父级   |
| `cd` 子目录     | 相对路径，子目录 |
| `cd C:\Windows` | 绝对路径         |
| `cd \Windows`   | 绝对路径         |

### 文件名
- 大小写不敏感
- 文件名后缀 `*.bat` & `*.cmd` 
- `dir /B` 只查看文件名

### 通配符
| code | desc           |
| ---- | -------------- |
| `?`  | 单个字符       |
| `*`  | 0、1或多个字符 |

### 目录 移动/重命名

 
### 清屏
| code  | desc |
| ----- | ---- |
| `cls` | 清屏 |

### 快捷键
| code     | desc         |
| -------- | ------------ |
| tab      | 自动完成     |
| 上下箭头 | 历史命令滚动 |
| Ctrl + C | 停止当前命令 |
| Alt + F7 | 清除历史     |
| F7       | 查看历史     |

### 目录 创建/删除
| code              | desc                     |
| ----------------- | ------------------------ |
| `mkdir` abc       | 创建子目录 abc           |
| `mkdir` "abc/def" | 创建子目录 abc/def       |
| `rmdir`           | 删除空文件夹             |
| `rmdir /s`        | 删除非空文件夹           |
| `rmdir /s /q`     | 删除非空文件夹，无需确认 |

### 复制
| code                 | desc                   |
| -------------------- | ---------------------- |
| `copy` src dst       | 复制文件               |
| `copy` /Y src dest   | 复制，无需确认直接覆盖 |
| `xcopy /s` src dest  | 复制非空目录及子目录   |
| `xcopy /YS` src dest | 同上，无需确认直接覆盖 |

`robocopy`是新版本的`xcopy`，基础功能一致

### 参数
| code        | desc           |
| ----------- | -------------- |
| `%0`        | 脚本名称       |
| `%1`...`%9` | 第1到9个参数   |
| `%*`        | 所有参数字符串 |
#### 参数大于10个时的处理
```bash
for %%x in (%*) do echo %%x
```

### 向脚本传递参数
#### parame­ter­s_s­cri­pt.bat
```bat
@echo off
call parame­ter­s_s­ubs­cri­pt.bat %*
EXIT /B %error­level%
```
#### parame­ter­s_s­ubs­cri­pt.bat
```bat
@ECHO off
echo subscript called with %*
EXIT /B 0
```
**EXIT / B**指定退出当前批处理脚本，而不是cmd.exe。 如果从批处理脚本外部执行，它将退出cmd.exe 

