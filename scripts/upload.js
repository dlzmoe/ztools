const ftp = require('./ftp');
const path = require('path');

// 连接ssh
const client = new ftp('xxxxxxxxx', 21, 'username', 'password', false);

// 本地上传目录
const distDir = path.resolve(__dirname, '../dist');

console.log(distDir);

// 服务器上传路径
client.upload(distDir, '/');
