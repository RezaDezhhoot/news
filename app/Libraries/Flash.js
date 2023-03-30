const flash = require('connect-flash');

exports.useByApp = (app) => {
    app.use(flash());
}