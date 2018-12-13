const CreatFiles = require('./creatFiles.js');
const {
	config
} = require('./config.js');
// const nodeIoSrcPath = resolve(config.entry); // 入口文件
// const nodeIoTestSpecsPath = resolve(config.output); // 出口文件

const creatFiles = (configs = {}) => {
	let includes = ['/src'];
	if (configs.includes !== undefined) {
		if (Array.isArray(configs.includes)) {
			if (configs.includes[0].indexOf('!') === 0) {
				includes = includes.concat(configs.includes);
			} else if (configs.includes[0].indexOf('.') !== -1) {
				throw Error('The first children of includes must be a dir, not is a file!');
			} else {
				includes = configs.includes;
			}
		} else {
			if (typeof(configs.includes) !== 'string') return;
			if (configs.includes.indexOf('!') === -1 && configs.includes[0].indexOf('.') !== -1) {
				throw Error('string in includes must be a dir, not is a file!');
			}
			if (configs.includes.indexOf('!') !== -1) {
				// arr.push('/src');
				// arr.push(configs.includes);
				includes.push(configs.includes);
			} else {
				includes[0] = configs.includes.replace(/(\*\*)?\/\*\*?/g, '');
			}
		}
	}
	configs.includes = includes;
	configs = Object.assign(config, configs);
	let creat = new CreatFiles(configs);
	creat.readDir();
	console.log('执行完毕!');
}

module.exports = creatFiles;