const path = require('path');

let fileEnv = '../config/envs/';

switch (process.env.pm_cwd) {
  case '/home/ivalentyn/www/read-helper': fileEnv += 'development.env'; break;
  default: { fileEnv += 'localhost.env'; break; }
}

require('dotenv').config({
  path: path.join(__dirname, `../${fileEnv}`),
});
