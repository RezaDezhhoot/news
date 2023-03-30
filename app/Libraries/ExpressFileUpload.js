const fileUpload = require('express-fileupload');
exports.useByApp = (app) => {
    app.use(fileUpload());
}