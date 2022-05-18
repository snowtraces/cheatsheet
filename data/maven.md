---
title: Maven
category: shell
updated: 2021-03-28
column_size: 2
auto_highlight: 1
---

通用语法：
```shell
mvn plugin:target [-Doption1 -Doption2 dots]
```

### 常见命令

| code     | desc                                                |
| -------- | --------------------------------------------------- |
| clean    | 删除target目录                                      |
| validate | 验证项目是否正确                                    |
| compile  | 编译源代码，类存储在 `target/classes`               |
| test     | 运行测试                                            |
| package  | 将编译后的代码打包成可分发的格式，例如 `jar`，`war` |
| verify   | 运行任何检查以验证 MVN 包是否有效并符合质量标准     |
| install  | 将包安装到本地 repository 中                        |
| deploy   | 将最终的 MVN 包复制到远程 repository                |

clean可以复合使用，例如`mvn clean package`，`mvn clean install`，进行全新的打包或安装。


### 创建新项目

#### 打包成 jar
```shell
mvn archetype:create -DgroupId=Artifact Group
                     -DartifactId=Artifact ID
```

#### 打包成 war

```bash
mvn archetype:create 
    -DgroupId=Artifact Group
    -DartifactId=Artifact ID
    -DarchetypeArtifactId=maven-archetype-webapp
```

### 安装第三方包到本地仓库
```bash
mvn install:install-file -Dfile=foo.jar 
        -DgroupId=org.foosoft -DartifactId=foo 
        -Dversion=1.2.3 -Dpackaging=jar
```

### 添加依赖
```xml
<project>
 …
 <dependencies>
 <dependency>
 <groupId>junit</groupId>
 <artifactId>junit</artifactId>
 <version>3.8.1</version>
 <scope>test</scope>
 </dependency>
 <dependency>
 <groupId>org.springframework</groupId>
 <artifactId>spring</artifactId>
 <version>1.2.6</version>
 </dependency>
 …
 </dependencies>
```

### 依赖作用域（scope）

#### compile
默认的scope，编译依赖项在项目的所有类路径中都可用，并且依赖关系会传播。
#### provided
很像compile，单表明希望JDK或容器在运行时提供依赖项。例如，在为 Java Enterprise Edition 构建 Web 应用程序时，您可以将 Servlet API 和相关 Java EE API 的依赖项设置为提供的范围，因为 Web 容器提供这些类。具有此范围的依赖项被添加到用于编译和测试的类路径中，但不会添加到运行时类路径中。它不是传递性的。
#### runtime
此scope表示该依赖项不是编译所必需的，而是执行所必需的。 Maven 在运行时和测试类路径中包含具有此范围的依赖项，但不包含在编译类路径中。
#### test
该作用域表示应用程序的正常使用不需要依赖，仅在测试编译和执行阶段可用。此作用域不可传递。通常，此范围用于测试库，例如 JUnit 和 Mockito。如果这些库用于单元测试 (src/test/java) 但不在模型代码 (src/main/java) 中，它也可用于非测试库，例如 Apache Commons IO。
#### system
类似于provided，但必须提供明确包含它的 JAR。该包始终可用，不会在存储库中查找。
#### import
仅在 `<dependencyManagement>` 部分中的 pom 类型依赖项上受支持。它指示依赖项将替换为指定 POM 的 <dependencyManagement> 部分中的有效依赖项列表。由于它们被替换，不具备传递性。 

### 添加开发者信息
```xml
<project>
 …
 <developers>
 <developer>
 <id>Baier</id>
 <name>Hans Baier</name>
 <email>hans.baier::at::focus-dv.de</email>
 <organization>focus DV GmbH</organization>
 <roles>
 <role>Developer</role>
 </roles>
 </developer>
 …
 </developers>
 ```

 ### 设置编译器版本
 ```xml
 <project>
 …
 <build>
 <plugins>
 <plugin>
 <artifactId>maven-compiler-plugin</artifactId>
 <configuration>
 <source>1.5</source>
 <target>1.5</target>
 </configuration>
 </plugin>
 …
 </plugins>
 </build>
 ```

 








