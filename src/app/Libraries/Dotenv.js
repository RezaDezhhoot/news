const dotenv = require('dotenv');
const path = require('path');
const appDir = path.dirname(require.main.filename);

dotenv.config({path:path.join(appDir,'.env')});