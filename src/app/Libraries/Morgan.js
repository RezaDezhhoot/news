const morgan = require('morgan');
const winston = require("../../config/winston");
exports.useByApp = (app) => {
    if (process.env.mode === 'development') {
        console.log('server running on development mode')
        app.use(morgan('dev'));
        app.use(morgan('combined',{stream: winston.stream}));
    }
}