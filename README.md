# TCPServerOnNodejs

作为测试TCP高并发的基础代码。目标为C1000K。

## Code说明
### 错误处理
最重要的一点是错误处理。主要原因就是，Node应用依托在一个拥有大量共享状态的大进程中，一旦一个错误被抛出了却又没有得到处理，那么整个进程都会遭殃。

至于`net`模块，一定要显示地对错误事件进行处理，哪怕什么都不做。

## Mac下进行并发测试时的配置
参考资料：[Mac的最大连接数限制和端口的相关参数的设置](http://tinylee.info/mac-maxfiles-portrange.html)

需要修改系统的最大连接数限制、进程最大连接数限制、shell能打开的最大文件数、动态端口范围。

###临时修改方案：
见参考资料

###永久修改方案：

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

## Linux

``` /etc/sysctl.conf
#原有字段
net.ipv4.tcp_syncookies = 1
#新增字段
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