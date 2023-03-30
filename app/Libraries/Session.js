const session = require('express-session');
const MongoStore = require("connect-mongo");

exports.useByApp = (app) => {
    app.use(session({
        secret: process.env.SESSION_SECRET,
        cookie: {maxAge:null},
        resave: false,
        saveUninitialized: false,
        unset: "destroy",
        store: MongoStore.create({mongoUrl:process.env.MONGO_URI})
    }));
}