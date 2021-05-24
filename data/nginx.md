---
title: nginx
category: Tool
updated: 2021-04-16
column_size: 2
from: https://github.com/VirtuBox/advanced-nginx-cheatsheet
---

### 端口 `listen`
```nginx
server {
  # 标准 HTTP 端口
  listen 80;
  
  # 标准 HTTPS 端口
  listen 443 ssl;
  
  # 使用 IPv6 监听 80 端口
  listen [::]:80;
  
  # 仅监听 IPv6 端口
  listen [::]:80 ipv6only=on;
}
```
### 域名 `server_name`
```nginx
server {
  # 监听域名 yourdomain.com
  server_name yourdomain.com;
  
  # 监听多个域名
  server_name yourdomain.com www.yourdomain.com;
  
  # 监听所有子域名
  server_name *.yourdomain.com;
  
  # 监听所有顶级域名
  server_name yourdomain.*;
  
  # 监听未指定域名 (listens to IP address itself)
  server_name "";
}
```
### 访问日志 `access_log`
```nginx
server {
  # 日志文件的相对或完整路径
  access_log /path/to/file.log;
  
  # Turn 'on' or 'off'
  access_log on;
}
```
### 杂项 `gzip`, `client_max_body_size`
```nginx
server {
  # Turn gzip compression 'on' or 'off'
  gzip on;
  
  # Limit client body size to 10mb
  client_max_body_size 10M;
}
```

## 文件服务
#### 静态资源
传统web服务
```nginx
server {
  listen 80;
  server_name yourdomain.com;
  
  location / {
  	root /path/to/website;
  }
}
```

#### 静态资源并使用 HTML5 History Mode
单页应用，如`Vue`, `React`, `Angular`等
```nginx
server {
  listen 80;
  server_name yourdomain.com;
  root /path/to/website;
  
  location / {
  	try_files $uri $uri/ /index.html;
  }
}
```

## 重定向
### `301` 永久重定向
可用于处理`www.yourdomain.com`和`yourdomain.com`，或者将`http`重定向到`https`。下面例子中`www.yourdomain.com`重定向到`yourdomain.com`。
```nginx
server {
  listen 80;
  server_name www.yourdomain.com;
  return 301 http://yourdomain.com$request_uri;
}
```
### `302` 临时重定向
```nginx
server {
  listen 80;
  server_name yourdomain.com;
  return 302 http://otherdomain.com;
}
```
### 特殊URL的重定向
```nginx
server {
  listen 80;
  server_name yourdomain.com;
  
  location /redirect-url {
	return 301 http://otherdomain.com;  
  }
}
```
## 反向代理

### 基本使用
```nginx
server {
  listen 80;
  server_name yourdomain.com;
  
  location / {
    proxy_pass http://0.0.0.0:3000;
    # 0.0.0.0:3000 是本地服务绑定的ip和端口
  }
}
```
或者先定义`upstream`
```nginx
upstream node_js {
  server 0.0.0.0:3000;
}

server {
  listen 80;
  server_name yourdomain.com;
  
  location / {
    proxy_pass http://node_js;
  }
}
```

### 升级连接（推荐用于Node.js应用程序） 
对于支持WebSockets（例如socket.io）的Node.js应用程序很有用。 
```nginx
upstream node_js {
  server 0.0.0.0:3000;
}

server {
  listen 80;
  server_name yourdomain.com;
  
  location / {
    proxy_pass http://node_js;
    proxy_redirect off;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
	
    # not required but useful for applications with heavy WebSocket usage
    # as it increases the default timeout configuration of 60
    proxy_read_timeout 80;
  }
}
```
## TLS/SSL (HTTPS)
### 基本使用
**以下配置只是TLS / SSL设置的一个示例。 不要将这些设置作为适用于您的应用程序的完美安全解决方案。 请研究最适合您的证书颁发机构的正确设置。**

如果您正在寻找免费的SSL证书，则[** Let's Encrypt **](https://letsencrypt.org/)是免费、自动、开放的证书颁发机构。另外，这是一个很棒的[Digital Ocean指南](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04)，了解如何在Ubuntu 16.04上设置TLS / SSL。 

```nginx
server {
  listen 443 ssl;
  server_name yourdomain.com;
  
  ssl on;
  
  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/privkey.pem;
  
  ssl_stapling on;
  ssl_stapling_verify on;
  ssl_trusted_certificate /path/to/fullchain.pem;

  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_session_timeout 1d;
  ssl_session_cache shared:SSL:50m;
  add_header Strict-Transport-Security max-age=15768000;
}

# Permanent redirect for HTTP to HTTPS
server {
  listen 80;
  server_name yourdomain.com;
  return 301 https://$host$request_uri;
}
```

## 负载均衡 

### php-fpm Unix socket

```nginx
upstream php {
    least_conn;

    server unix:/var/run/php/php-fpm.sock;
    server unix:/var/run/php/php-two-fpm.sock;

    keepalive 5;
}
```
`least_conn`选取活跃连接数与权重weight的比值最小者为下一个处理请求的server

### php-fpm TCP

```nginx
upstream php {
    least_conn;

    server 127.0.0.1:9090;
    server 127.0.0.1:9091;

    keepalive 5;
}
```

### HTTP 负载均衡

```nginx
# Upstreams
upstream backend {
    least_conn;

    server 10.10.10.1:80;
    server 10.10.10.2:80;
}

server {
    server_name site.ltd;

    location / {
        proxy_pass http://backend;
        proxy_redirect      off;
        proxy_set_header    Host            $host;
        proxy_set_header    X-Real-IP       $remote_addr;
        proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 代理

### 简单代理

```nginx
location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_redirect      off;
        proxy_set_header    Host            $host;
        proxy_set_header    X-Real-IP       $remote_addr;
        proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
    }
```

### 子文件夹代理

```nginx
location /folder/ { # The / is important!
        proxy_pass http://127.0.0.1:3000/; # The / is important!
        proxy_redirect      off;
        proxy_set_header    Host            $host;
        proxy_set_header    X-Real-IP       $remote_addr;
        proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
    }
```

### websocket keepalive 代理

```nginx
# Upstreams
upstream backend {
    server 127.0.0.1:3000;
    keepalive 5;
}
# HTTP Server
server {
    server_name site.tld;
    error_log /var/log/nginx/site.tld.access.log;
    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forward-Proto http;
        proxy_set_header X-Nginx-Proxy true;
        proxy_redirect off;
    }
}
```

### 反向代理 Apache

```nginx
server {

    server_name domain.tld;

    access_log /var/log/nginx/domain.tld.access.log;
    error_log /var/log/nginx/domain.tld.error.log;

    root /var/www/domain.tld/htdocs;

    # pass requests to Apache backend
    location / {
        proxy_pass http://backend;
    }
    # handle static files with a fallback
    location ~* \.(ogg|ogv|svg|svgz|eot|otf|woff|woff2|ttf|m4a|mp4|ttf|rss|atom|jpe?g|gif|cur|heic|png|tiff|ico|zip|webm|mp3|aac|tgz|gz|rar|bz2|doc|xls|exe|ppt|tar|mid|midi|wav|bmp|rtf|swf|webp)$ {
        add_header "Access-Control-Allow-Origin" "*";
        access_log off;
        log_not_found off;
        expires max;
        try_files $uri @fallback;
    }
    # fallback to pass requests to Apache if files are not found
    location @fallback {
        proxy_pass http://backend;
    }
}
```

## Nginx 安全

### 访问限制 

#### 常用备份和存档文件

```nginx
location ~* "\.(old|orig|original|php#|php~|php_bak|save|swo|aspx?|tpl|sh|bash|bak?|cfg|cgi|dll|exe|git|hg|ini|jsp|log|mdb|out|sql|svn|swp|tar|rdf)$" {
    deny all;
}
```

#### 限制访问隐藏文件和文件夹

```nginx
location ~ /\.(?!well-known\/) {
    deny all;
}
```

### 阻止常见攻击

#### base64 encoded url

```nginx
location ~* "(base64_encode)(.*)(\()" {
    deny all;
}
```

#### javascript eval() url

```nginx
location ~* "(eval\()" {
    deny all;
}
```

## Nginx Media

### MP4 stream module

```nginx
location /videos {
    location ~ \.(mp4)$ {
        mp4;
        mp4_buffer_size       1m;
        mp4_max_buffer_size   5m;
        add_header Vary "Accept-Encoding";
        add_header "Access-Control-Allow-Origin" "*";
        add_header Cache-Control "public, no-transform";
        access_log off;
        log_not_found off;
        expires max;
    }
}
```

### WebP images

Mapping conditions to display WebP images

```nginx
# 如果Web浏览器支持WebP，则提供WebP图像
map $http_accept $webp_suffix {
   default "";
   "~*webp" ".webp";
}
```