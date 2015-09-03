
第一次测试，双核作为服务器，多个作为客户端进行连接。最多只达到16000（应该是系统的配置原因所致），每个CPU核心支撑的TCP并发连接数大概在8000.

以下是测试中的CPU占用情况。

```
$ ps aux | grep node
wzl              1039  56.6  0.7  3153516 121120 s000  R+    8:29下午   1:53.71 node client.js
wzl              1104  45.6  0.8  3161068 129916 s002  R+    8:32下午   0:24.74 node client.js
wzl              1030  39.4  0.5  3109072  77528 s001  R+    8:29下午   1:02.57 /usr/local/bin/node --debug-port=5859 /Users/wzl/Documents/node_study/tcp/server.js
wzl              1031  38.9  0.5  3107916  76244 s001  S+    8:29下午   1:01.66 /usr/local/bin/node --debug-port=5860 /Users/wzl/Documents/node_study/tcp/server.js
wzl              1118   4.3  0.7  3151048 118660 s003  S+    8:32下午   0:17.87 node client.js
wzl              1029   0.0  0.2  3087272  32412 s001  S+    8:29下午   0:01.23 node server.js
```

