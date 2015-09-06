## 测试1

测试所用的机器为公司台式机，酷睿i7四核处理器，单机发起的测试。单个核心运行TCP服务，另外开启多个client.js，每个客户端发起10000个TCP连接。可以比较顺利地实现40K并发。

内存使用情况：

```
$ free -m -t
             total       used       free     shared    buffers     cached
Mem:          7915       2021       5893         24         44        427
-/+ buffers/cache:       1549       6365
Swap:        15257          0      15257
Total:       23173       2021      21151
```

CPU占用情况：

```
$ ps aux | grep node
USER      PID  %CPU %MEM VSZ    RSS   TT       STAT STARTED TIME COMMAND
wzl       2661  0.0  0.2 972400 22172 pts/2    Sl+  16:41   0:00 node /home/wzl/node/bin/supervisor server.js
wzl       2801 94.8  2.2 801296 179012 pts/2   Rl+  16:41   5:13 node server.js
wzl       2921 47.4  1.5 755128 129588 pts/0   Rl+  16:41   2:31 node client.js
wzl       3000 42.2  1.7 766776 140012 pts/17  Rl+  16:42   2:12 node client.js
wzl       3071 47.8  1.6 760156 134520 pts/25  Rl+  16:42   2:27 node client.js
wzl       3243 42.6  1.9 780072 154728 pts/26  Rl+  16:42   1:58 node client.js
```


## test 2

```
wzl@wzl:~/DevelopProjects/TCPServerOnNodejs$ ps aux | grep node
USER      PID  %CPU %MEM VSZ    RSS   TT       STAT STARTED TIME COMMAND
wzl       7675  1.8  0.8 692584 66652 pts/12   Sl+  10:07   0:05 node server.js
wzl       7680 17.5  1.2 729036 103952 pts/12  Sl+  10:07   0:57 /home/wzl/node/bin/node --debug-port=5859 /home/wzl/DevelopProjects/TCPServerOnNodejs/server.js
wzl       7681 17.1  1.3 731672 105608 pts/12  Sl+  10:07   0:56 /home/wzl/node/bin/node --debug-port=5860 /home/wzl/DevelopProjects/TCPServerOnNodejs/server.js
wzl       7682 16.4  1.0 713888 88780 pts/12   Sl+  10:07   0:54 /home/wzl/node/bin/node --debug-port=5861 /home/wzl/DevelopProjects/TCPServerOnNodejs/server.js
wzl       7683 17.2  1.0 707388 81200 pts/12   Sl+  10:07   0:56 /home/wzl/node/bin/node --debug-port=5862 /home/wzl/DevelopProjects/TCPServerOnNodejs/server.js
wzl       7684 21.6  1.1 718288 91784 pts/12   Rl+  10:07   1:11 /home/wzl/node/bin/node --debug-port=5863 /home/wzl/DevelopProjects/TCPServerOnNodejs/server.js
wzl       7685 17.5  1.2 723168 99936 pts/12   Sl+  10:07   0:57 /home/wzl/node/bin/node --debug-port=5864 /home/wzl/DevelopProjects/TCPServerOnNodejs/server.js
wzl       7690 17.0  1.2 724180 98348 pts/12   Sl+  10:07   0:56 /home/wzl/node/bin/node --debug-port=5865 /home/wzl/DevelopProjects/TCPServerOnNodejs/server.js
wzl       7695 17.6  0.9 704956 79952 pts/12   Sl+  10:07   0:57 /home/wzl/node/bin/node --debug-port=5866 /home/wzl/DevelopProjects/TCPServerOnNodejs/server.js
```