const path = require('path');
const appDir = path.dirname(require.main.filename);
const {Headers} = require('../Base/Middlewares/Headers');

exports.loadApiRoutes = (app) => {
    // Set global headers:
    app.use(Headers);

    // Authentication API routes V1:
    const {routerV1} = require(path.join(appDir,'app','Modules/Auth/Routes/api.js'));
    app.use('/api/v1',routerV1);
}

exports.loadAdminRoutes = (app) => {
    // Authentication admin routes:
    const {routerAdmin} = require(path.join(appDir,'app','Modules/Auth/Routes/admin.js'));
    app.use('/admin/auth',routerAdmin);
}