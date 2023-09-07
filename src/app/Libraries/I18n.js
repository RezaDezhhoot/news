const i18n = require('../../config/i18n');

exports.useByApp = (app) => {
    app.use(i18n.init);
}