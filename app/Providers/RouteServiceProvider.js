const path = require('path');
const appDir = path.dirname(require.main.filename);
const {Headers} = require('../Base/Middlewares/Headers');
const rateLimit = require("express-rate-limit");

exports.loadApiRoutes = (app) => {
    // Set global headers:
    app.use('/api',Headers);

    app.use(
        '/api',
        rateLimit({
            windowMs: 3 * 60 * 60 * 1000,
            max: 250,
            message: {
                message: 'too many requests'
            },
            headers: true,
        })
    );

    // Authentication API routes V1:
    const {routerV1} = require(path.join(appDir,'app','Modules/Auth/Routes/api.js'));
    app.use('/api/v1/auth',routerV1);

    // User API routes V1:
    const {userRouterV1} = require(path.join(appDir,'app','Modules/User/Routes/api.js'));
    app.use('/api/v1/user',userRouterV1);

    // Category API routes V1:
    const {categoryRouterV1} = require(path.join(appDir,'app','Modules/Category/Routes/api.js'));
    app.use('/api/v1/categories',categoryRouterV1);

    // Gallery API routes V1:
    const {galleryRouterV1 , galleryRouterV2} = require(path.join(appDir,'app','Modules/Gallery/Routes/api.js'));
    app.use('/api/v1/galleries',galleryRouterV1);
    app.use('/api/v21/galleries',galleryRouterV2);

    // Article API routes V1:
    const {articleRouterV1} = require(path.join(appDir,'app','Modules/Article/Routes/api.js'));
    app.use('/api/v1/articles',articleRouterV1);

    // Channel API routes V1:
    const {channelRouterV1} = require(path.join(appDir,'app','Modules/Chat/Routes/api.js'));
    app.use('/api/v1/channels',channelRouterV1);

    // Chat API routes V1:
    const {chatRouterV1} = require(path.join(appDir,'app','Modules/Chat/Routes/api.js'));
    app.use('/api/v1/chats',chatRouterV1);
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

    // Gallery admin routes:
    const {routerGalleryAdmin} = require(path.join(appDir,'app','Modules/Gallery/Routes/admin.js'));
    app.use('/admin/galleries',routerGalleryAdmin);

    // Article admin routes:
    const {routerArticleAdmin} = require(path.join(appDir,'app','Modules/Article/Routes/admin.js'));
    app.use('/admin/articles',routerArticleAdmin);

    // Channel admin routes:
    const {routerChatAdmin} = require(path.join(appDir,'app','Modules/Chat/Routes/admin.js'));
    app.use('/admin/channels',routerChatAdmin);

    // Redis admin routes:
    const {routerRedis} = require(path.join(appDir,'app','Modules/Redis/Routes/admin.js'));
    app.use('/admin/redis',routerRedis);
}