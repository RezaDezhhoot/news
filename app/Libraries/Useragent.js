const useragent = require('express-useragent');

exports.useByApp = (app) => {
    app.use(useragent.express());
}