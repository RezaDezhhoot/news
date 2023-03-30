const connectDB = require('../../config/database');
connectDB().then((r)=>console.log('DB ok'));
