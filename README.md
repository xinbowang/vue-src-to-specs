### vue单元测试——根据src目录文件在test/unit/specs下生成对应测试文件的插件
#### 基于vue-mock测试生成目录结构；
#### 安装
```
	npm i vue-src-to-specs -D
```
#### 用法: 引入*.conf.js或者index.js，基于node.js运行;
```
	const creatFiles = require('vue-src-to-specs');
	creatFiles([!options]);
```
##### 新增options配置: 非必须
```
	options: {
		includes: ['src', '!src/**/*.html', '!src/**/*.js'],
		store: true
	}
```
##### 说明：
1. includes: ([Array]/'String':默认'/src') 数组/字符串
1.1 !：表示排除的文件/文件夹;
1.2 数组第一个参数：如果不是要排除文件/文件夹，那么默认是入口文件夹（不支持文件做入口）。建议不设置【多个非排除目录，只执行第一个目录，后面的非排除目录不会执行】;
2.store: (Boolean:默认false)
2.1 是否需要写入store相关配置
