### vue单元测试——根据src目录文件在test/unit/specs下生成对应测试文件的插件(Vue unit tests -- the plug-in to the test file is generated from the SRC directory file under test/unit/specs)
#### node支持版本：10.0以上(Node.js support version: 10.0 or above)
#### 基于vue-mock测试生成目录结构；(Generate directory structure based on ue-mock test;)
#### 安装(The installation)
```
    npm i vue-src-to-specs -D
```
#### 用法: 引入*.conf.js或者index.js，基于node.js运行;(Usage: *.conf.js or index.js is introduced to run node.js.)
```
    const creatFiles = require('vue-src-to-specs');
    creatFiles(/* options */);
```
#### options配置实例: 非必须(options configuration instance: not required)
```
    options: {
        extensions: ['.vue', '.js']
        includes: ['src', '!src/**/*.html', '!src/**/*.js'],
        store: true
    }
```
#### 说明：(Description)
* extensions: ([Array]/'String': [default:'']) Array/String
    * 表示读取文件类型(Represents the read file type)
* includes: ([Array]/'String': [default:'/src']) Array/String
    * !：Represents the excluded files/folders;
    * 数组第一个参数：如果不是要排除文件/文件夹，那么默认是入口文件夹（不支持文件做入口）。建议不设置【多个非排除目录，只执行第一个目录，后面的非排除目录不会执行】(The first argument to the array: if you do not want to exclude files/folders, the default is the entry folder (files as entries are not supported). It is recommended not to set [multiple non-exclusive directories, only the first directory will be executed, and the subsequent non-exclusive directories will not be executed].);
* store: (Boolean: [default:false])
    * 是否需要写入store相关配置(Whether store-related configuration needs to be written)

## 如有其它建议，欢迎在GitHub上留言！！！(If you have any other Suggestions, please leave them on GitHub!!!)

