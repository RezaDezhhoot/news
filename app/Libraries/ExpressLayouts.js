const express_layouts = require('express-ejs-layouts');
const path = require('path');
const appDir = path.dirname(require.main.filename);

exports.useByApp = (app) => {
    app.use(express_layouts);
    app.set('view engine','ejs');
    app.set('layout',path.join(appDir,'resources/views/layouts/admin.ejs'));
    app.set('views',path.join(appDir,'resources/views'));
}