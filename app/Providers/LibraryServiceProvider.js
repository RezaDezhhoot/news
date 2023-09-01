const path = require('path');
const appDir = path.dirname(require.main.filename);
const LibraryDir = path.join(appDir,'app','Libraries');

exports.load = (app) => {
    require(path.join(LibraryDir,'Dotenv.js'));

    require(path.join(LibraryDir,'ConnectMongo.js'));

    require(path.join(LibraryDir,'ExpressFileUpload.js')).useByApp(app);

    require(path.join(LibraryDir,'ExpressLayouts.js')).useByApp(app);

    require(path.join(LibraryDir,'Session.js')).useByApp(app);

    require(path.join(LibraryDir,'Flash.js')).useByApp(app);

    require(path.join(LibraryDir,'Morgan.js')).useByApp(app);

    require(path.join(LibraryDir,'Passport.js')).useByApp(app);

    require(path.join(LibraryDir,'I18n.js')).useByApp(app);

    require(path.join(LibraryDir,'cookieParser.js')).useByApp(app);
}