# TCPServerOnNodejs

作为测试TCP高并发的基础代码。

目标为C1000K。

并发问题的处理，有两种模式。一是事件驱动并发模式，二是多线程并发模式。前者的代表是Nginx，NodeJS。

## 代码说明
### 文件介绍
`server.js`为服务器端程序。开启服务时无需指定HOST（或者将其设为0.0.0.0即可）。

`client.js`为测试用的客户端程序。

`./config/index.js`为简单的配置文件。里面指明了服务器所在的HOST地址，以及其所监听的端口。

### 错误处理
最重要的一点是错误处理。主要原因就是，Node应用依托在一个拥有大量共享状态的大进程中，一旦一个错误被抛出了却又没有得到处理，那么整个进程都会遭殃。

至于`net`模块，一定要显示地对错误事件进行处理，哪怕什么都不做。

## Mac下进行并发测试时的配置
参考资料[1]：[Mac的最大连接数限制和端口的相关参数的设置](http://tinylee.info/mac-maxfiles-portrange.html)

需要修改系统的最大连接数限制、进程最大连接数限制、shell能打开的最大文件数、动态端口范围。

### 临时修改方案：
见参考资料[1].

### 永久修改方案：

把参数写到/etc/sysctl.conf文件中，但是，默认这个文件是不存在的，所以首先就要创建它：

```
sudo touch /etc/sysctl.conf
```

然后将下面的设置写入该文件并保存：

```
kern.maxfiles=1048600
kern.maxfilesperproc=1048576
net.inet.ip.portrange.first=10000   
net.inet.ip.portrange.last=65535
```

ulimit-n的值，可以把ulimit－n 1048576 写到.bashrc中实现自动修改。

## Linux配置
### 内核参数优化
首先应尽可能使用最新的Linux内核。

> TCP的最佳实践以及影响其性能的底层算法一直在与时俱进，而且大多数变化只在最新内核中才有实现。一句话，让你的服务器跟上时代是优化发送端和接收端TCP栈的首要措施。
> 《Web性能权威指南》，page 29

参考《深入理解Nginx：模块开发与架构解析》

打开`/etc/sysctl.conf`文件，如下添加或改动，然后执行`sysctl -p`命令即可生效。

```
#原有字段
net.ipv4.tcp_syncookies = 1
#新增字段及含义
fs.file-max = 999999
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_max_tw_buckets = 10000
net.ipv4.ip_local_port_range = 1024 61000
net.ipv4.tcp_rmem = 10240 87380 12582912
net.ipv4.tcp_wmem = 10240 87380 12582912
net.core.netdev_max_backlog = 8096
net.core.rmem_default = 6291456
net.core.wmem_default = 6291456
net.core.rmem_max = 12582912
net.core.wmem_max = 12582912
net.ipv4.tcp_max_syn_backlog = 1024
```

### 内核参数字段及含义

file-max: 表示一个进程（比如一个SHELL）可以同时打开的最大句柄数，这个参数直接限制最大并发连接数，需要根据实际情况进行配置

tcp_tw_reuse: 1表示允许将处于TIME-WAIT状态的socket重新用于新的TCP连接

tcp_keepalive_time: 表示当keepalive启用时，TCP发送keepalive消息的频度。默认是2小时，若将其设得小一点，可以更快地清理无效的连接。

tcp_fin_timeout: 表示当服务器主动关闭连接时，socket保持在FIN-WAIT-2状态的最大时间

tcp_max_tw_buckets: 表示操作系统允许TIME-WAIT套接字数量的最大值，如果超过这个数字，TIME_WAIT套接字将立刻被清除并打印警告消息。该参数默认是180000，过多的TIME_WAIT套接字会使WEB服务器变慢。

ip_local_port_range: 定义了在UDP和TCP连接中，本地（不包括连接的远端）端口的取值范围。

net.ipv4.tcp_rmem TCP接收缓存（用于TCP接收滑动窗口）的最小值、默认值、最大值，单位是字节

net.ipv4.tcp_wmem TCP发送缓存（用于TCP发送滑动窗口）的最小值、默认值、最大值，单位是字节

[TCP Variables](https://www.frozentux.net/ipsysctl-tutorial/chunkyhtml/tcpvariables.html) 里有对上面这两个参数的详细介绍。

net.core.netdev_max_backlog 当网卡接收数据包的速度大于内核处理的速度时，会有一个队列保存这些数据包。netdev_max_backlog 参数表示该队列的最大值。

net.core.rmem_default 内核套接字接收缓存区的默认大小

net.core.wmem_default 内核套接字发送缓存区的默认大小

net.core.rmem_max 内核套接字接收缓存区的最大大小

net.core.wmem_max：内核套接字发送缓存区的最大大小

tcp_max_syn_backlog: 表示TCP三次握手建立阶段接收SYN请求队列的最大长度，默认为1024.将其设置得大一些可以在Nginx繁忙而来不及接收新连接的情况下，使得Linux不至于丢失客户端发起的连接请求。

### 客户端设置
对于客户端，应该设置Linux系统对用户打开文件数的软限制或硬限制（全局）。以提高单个PC作为测试客户端时可以发起的TCP连接上限。（其实服务器端也应该这样设置）

（1）修改 `/etc/security/limits.conf`，添加：

```
* soft nofile 1000000
* hard nofile 1800000
```

这两个参数是关于进程最大打开文件描述符数。各个值的约束关系：

+ 所有进程打开的文件描述符数不能超过/proc/sys/fs/file-max
+ 单个进程打开的文件描述符数不能超过user limit中nofile的soft limit
+ nofile的soft limit不能超过其hard limit
+ nofile的hard limit不能超过/proc/sys/fs/nr_open

打开`/proc/sys/fs/nr_open`文件，可以发现，其默认值为 1048576.如果想做更大规模的并发测试，这个值就得改得足够大了。

参考： [Linux最大打开文件描述符数](http://blog.csdn.net/superchanon/article/details/13303705)

（2）修改`/etc/pam.d/login`文件，在文件中添加如下行（Ubuntu 14.04默认是有这个设置的，所以确认存在后可以不做改动）：
```
session required /lib/security/pam_limits.so
```

重启后应该可以生效。这时在终端里查看`ulimit -n`应该就是1000000了。
