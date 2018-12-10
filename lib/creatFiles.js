const fs = require('fs');
const path = require('path');

class CreatFiles {
	constructor(config) {
		this.srcPath = path.join(__dirname, '..', config.entry);
		this.specsPath = path.join(__dirname, '..', config.output);
	}
	readDir(readSrcPath) {
		readSrcPath = readSrcPath || this.srcPath;
		fs.readdir(readSrcPath, {
			withFileTypes: true // 返回一个dirent，用于判断文件读取结果类型
		}, (err, files) => {
			if (!err) {
				files.map(ele => {
					// 判断是否是文件夹
					let dirPath = readSrcPath.replace(this.srcPath, '');
					if (this.isDir(ele)) {
						this.mkDir(`${this.specsPath}${dirPath}/${ele.name}`);
						// 递归文件夹
						this.readDir(`${readSrcPath}/${ele.name}`);
					} else if (this.isFiles(ele)) {
						// 根据文件创建文件夹
						this.mkDir(`${this.specsPath}${dirPath}/${ele.name}`);
						// 判断文件是否存在
						fs.access(`${this.specsPath}${dirPath}/${ele.name}/${ele.name}.spec.js`, fs.constants.F_OK, (err) => {
							if (err) {
								let fileName = ele.name.split('.')[0];
								let upperFileName = this.firstUpperCase(fileName);
								let str = `import { mount } from 'vue-test-utils';\nimport ${upperFileName} from '@${dirPath}/${fileName}';\n\ndescribe('component is load', () => {\n\tit('component is load', () => {\n\t\tconst wrapper = mount(${upperFileName});\n\t\t// 断言事件\n\t\texpect(wrapper).to.eql(wrapper);\n\t});\n});`;
								// 根据文件创建文件夹->创建测试文件
								let writeStream = this.mkFile(`${this.specsPath}${dirPath}/${ele.name}/${ele.name}.spec.js`);
								console.log(`${ele.name}.spec.js:----------创建完成！`);
								writeStream.write(str);
								writeStream.end();
							} else {
								console.log(`${ele.name}.spec.js:----------文件已存在！`);
							}
						})

					} else {
						console.log(`${ele.name}:不是文件夹已不是文件，那你是什么?`);
					}
				})
			}
		})
	}
	isDir(dir) {
		return dir.isDirectory();
	}
	isFiles(file) {
		return file.isFile();
	}
	mkDir(pathDir) {
		fs.mkdir(pathDir, {
			recursive: true
		}, (err) => {
			if (err) throw err;
		});
	}
	mkFile(pathFile) {
		// 根据文件创建文件夹->创建测试文件
		return fs.createWriteStream(pathFile);
	}
	firstUpperCase(str) { // 首字母大写
		return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
	}
}

module.exports = CreatFiles;