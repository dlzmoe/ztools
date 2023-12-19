const ftp = require('basic-ftp');
const chalk = require('chalk');
const cliProgress = require('cli-progress');
const getTotalSize = require('./getSize');

class FTPClient {
  constructor(host = 'localhost', port = 21, username = 'anonymous', password = 'guest', secure = false) {
    this.client = new ftp.Client();
    this.settings = {
      host: host,
      port: port,
      user: username,
      password: password,
      secure: secure,
    };
  }

  upload(sourcePath, remotePath) {
    let self = this;
    (async () => {
      try {
        console.log(chalk.green('链接ftp服务器...'));
        await self.client.access(self.settings);
        await self.client.ensureDir(remotePath);

        console.log(chalk.green('清空ftp目录...'));
        await self.client.clearWorkingDir();

        console.log(chalk.green('上传文件...'));

        // 创建进度条
        const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.legacy);
        bar1.start(getTotalSize(sourcePath), 0);

        self.client.trackProgress((info) => {
          bar1.update(info.bytesOverall);
        });

        await self.client.uploadFromDir(sourcePath);

        bar1.stop();
        console.log(chalk.cyan('上传成功'));
      } catch (err) {
        console.log(chalk.red('上传失败'));
        console.log(err);
      }
      self.client.close();
    })();
  }

  close() {
    this.client.close();
  }
}

module.exports = FTPClient;
