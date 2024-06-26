# 一个命令行工具合集

一个主要由node实现的工具集合  
目前实现的工具有
- 计算userId在哪个分表里
- 敏感信息加解密工具
- 生成一个指定长度的随机字符串

使用方式
``` sh
./node/crypto.js AES <beta|prod> en <敏感信息明文>
./node/crypto.js AES <beta|prod> de <敏感信息密文>

./node/crypto.js random [length]

./node/crypto.js hash <data>
```
