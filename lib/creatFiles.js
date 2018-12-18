const fs = require('fs');
const path = require('path');

class CreatFiles {
	constructor(config) {
		this.srcPath = path.join(__dirname, '..', config.includes[0]).replace(/\\/g, '/').replace(/\/node_modules\/(.+)?vue-src-to-specs(.+)?/, '') + '' + config.includes[0];
		this.specsPath = path.join(__dirname, '..', config.output).replace(/\\/g, '/').replace(/\/node_modules\/(.+)?vue-src-to-specs(.+)?/, '') + '' + config.output;
		this.includes = config.includes;
		this.store = config.store;
		this.extensions = config.extensions;
	}
	isDirExclude(readSrcPath, filePath) {
		if (this.includes.length === 0) return false;
		let bool = false;
		let excludes = this.includes.map(ele => {
			let filesReg = '';
			if (ele.indexOf('!') === 0) {
				if (path.basename(ele).indexOf('.') !== -1) { // 文件
					filesReg = new RegExp(path.dirname(ele).replace(/!/, '').replace(/(\*\*)?\/\*\*?/g, '') + '/.+\\' + path.basename(ele).replace(/\*+?/g, ''));
				} else { // 文件夹
					filesReg = new RegExp(ele.replace(/!/, '').replace(/\*{1,}\/\*{1,}/g, '.+').replace(/(\*\*)?\/\*\*?/g, '.+') + '.+');
				}
				bool = filesReg.test(readSrcPath + '/' + filePath.name);
			}
			return bool;
		});
		return excludes.slice(1).some(ele => ele);
	}
	isExtensions(extension) {
		let bool = false;
		if (Array.isArray(this.extensions)) {
			bool = this.extensions.map(ele => {
				return path.extname(extension.name) === ele;
			}).some(ele => ele);
		} else if (typeof this.extensions === 'string') {
			bool = path.extname(extension.name) === this.extensions;
		}
		return bool;
	}
	readDir(readSrcPath) {
		readSrcPath = readSrcPath || this.srcPath;
		fs.readdir(readSrcPath, {
			withFileTypes: true // 返回一个dirent，用于判断文件读取结果类型
		}, (err, files) => {
			if (!err) {
				files.map(ele => {
					if (this.isDirExclude(readSrcPath, ele) || ele.name.indexOf('.') === 0) return;
					// 判断是否是文件夹
					let dirPath = readSrcPath.replace(this.srcPath, '');
					if (this.isDir(ele)) {
						this.mkDir(`${this.specsPath}${dirPath}/${ele.name}`);
						// 递归文件夹
						this.readDir(`${readSrcPath}/${ele.name}`);
					} else if (this.isFiles(ele)) {
						if (!this.isExtensions(ele)) return;
						// 根据文件创建文件夹
						this.mkDir(`${this.specsPath}${dirPath}/${ele.name}`);
						// 判断文件是否存在
						fs.access(`${this.specsPath}${dirPath}/${ele.name}/${ele.name}.spec.js`, fs.constants.F_OK, (err) => {
							if (err) {
								let fileName = ele.name.split('.')[0];
								let upperFileName = this.firstUpperCase(fileName);
								let str = `import { mount } from 'vue-test-utils';\nimport ${upperFileName} from '@${dirPath}/${fileName}';\n\ndescribe('component is load', () => {\n\tit('component is load', () => {\n\t\tconst wrapper = mount(${upperFileName});\n\t\t// 断言事件\n\t\texpect(wrapper).to.eql(wrapper);\n\t});\n});`;
								let strStore = `import { mount, createLocalVue } from 'vue-test-utils';\nimport ${upperFileName} from '@${dirPath}/${fileName}';\nimport Vuex from 'vuex';\nconst localVue = createLocalVue();\nlocalVue.use(Vuex);\n\ndescribe('component is load', () => {\n\tlet store;\n\tbeforeEach(() => {\n\t\tstore = new Vuex.Store({});\n\t});\n\tit('component is load', () => {\n\t\tconst wrapper = mount(${upperFileName},{\n\t\t\tstore,\n\t\t\tlocalVue\n\t\t});\n\t\t// 断言事件\n\t\texpect(wrapper).to.eql(wrapper);\n\t});\n});`;
								// 根据文件创建文件夹->创建测试文件
								let writeStream = this.mkFile(`${this.specsPath}${dirPath}/${ele.name}/${ele.name}.spec.js`);
								this.store ? writeStream.write(strStore) : writeStream.write(str);
								console.log(`${ele.name}.spec.js:----------创建完成！`);
								writeStream.end();
							} else {
								console.log(`${ele.name}.spec.js:----------文件已存在！`);
							}
						})

					} else {
						console.log(`${ele.name}:不是文件夹已不是文件，那你是什么?`);
					}
				})
			} else {
				return;
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
		fs.mkdirSync(pathDir, {
			recursive: true
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