import nconf from 'nconf';
import path from 'path';

nconf
  // 1. CMD Arguments
  .argv()
  // 2. 환경 변수
  .env([
    'GCLOUD_PROJECT',
    'DATA_BACKEND',
    'MONGO_URL',
    'CLOUD_BUCKET',
    'OAUTH2_CLIENT_ID',
    'OAUTH2_CLIENT_SECRET',
    'OAUTH2_CALLBACK',
    'MEMCACHE_URL',
    'NODE_ENV',
    'TOPIC_NAME',
    'SUBSCRIPTION_NAME',
    'PORT',
    'SECRET',
  ])
  // 3. Config file
  .file({ file: path.join(__dirname, '../', 'config.json') })
  // 4. Defaults
  .defaults({
    PORT: 8080,
    SECRET: 'yangkiyeopsecret',
    NODE_ENV: 'development',
  });

function checkConfig(setting) {
  if (!nconf.get(setting)) {
    throw new Error(`You must set ${setting} as an environment variable or in config.json!`);
  }
}

// 필수 세팅 체크
checkConfig('GCLOUD_PROJECT');
checkConfig('CLOUD_BUCKET');
checkConfig('OAUTH2_CLIENT_ID');
checkConfig('OAUTH2_CLIENT_SECRET');
if (nconf.get('DATA_BACKEND') === 'mongodb') {
  checkConfig('MONGO_URL');
}

export default nconf;
