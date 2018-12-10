const CreatFiles = require('./creatFiles.js');
const {
	config
} = require('./config.js');
// const nodeIoSrcPath = resolve(config.entry); // 入口文件
// const nodeIoTestSpecsPath = resolve(config.output); // 出口文件

const creatFiles = (configs) => {
	configs = configs || config;
	let creat = new CreatFiles(configs);
	creat.readDir();
	console.log('执行完毕!');
}

module.exports = creatFiles;