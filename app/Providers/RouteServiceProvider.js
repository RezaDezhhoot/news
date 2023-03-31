const path = require('path');
const appDir = path.dirname(require.main.filename);
const {Headers} = require('../Base/Middlewares/Headers');

exports.loadApiRoutes = (app) => {
    // Set global headers:
    app.use(Headers);

    // Authentication API routes V1:
    const {routerV1} = require(path.join(appDir,'app','Modules/Auth/Routes/api.js'));
    app.use('/api/v1/auth',routerV1);

    // User API routes V1:
    const {userRouterV1} = require(path.join(appDir,'app','Modules/User/Routes/api.js'));
    app.use('/api/v1/user',userRouterV1);
}

exports.loadAdminRoutes = (app) => {
    // Authentication admin routes:
    const {routerAdmin} = require(path.join(appDir,'app','Modules/Auth/Routes/admin.js'));
    app.use('/admin/auth',routerAdmin);

    // User admin routes:
    const {routerUserAdmin} = require(path.join(appDir,'app','Modules/User/Routes/admin.js'));
    app.use('/admin',routerUserAdmin);

    // Category admin routes:
    const {routerCategoryAdmin} = require(path.join(appDir,'app','Modules/Category/Routes/admin.js'));
    app.use('/admin/categories',routerCategoryAdmin);
}