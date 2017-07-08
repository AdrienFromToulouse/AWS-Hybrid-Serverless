import tmp from 'tmp';

global.setup = (() => {
  // Create tmp dir
  const tmpDir = tmp.dirSync();
  const tmpDirName = tmpDir.name;
  process.env.DOWNLOAD_ROOT_PATH = tmpDirName;
})();
