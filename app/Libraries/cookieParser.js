const cookieParser = require('cookie-parser');
exports.useByApp = (app) => {
    app.use(cookieParser());
}