# TCPServerOnNodejs

作为测试TCP高并发的基础代码。目标为C1000K。

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
