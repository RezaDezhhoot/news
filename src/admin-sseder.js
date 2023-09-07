const path = require('path');
const appDir = path.dirname(require.main.filename);
const LibraryDir = path.join(appDir,'app','Libraries');
require(path.join(LibraryDir,'Dotenv.js'));
const connectDB = require('./config/database');
const roles = require('./app/Base/Constants/Role');
const User = require("./app/Modules/User/Models/User");

connectDB().then(async (r) => {
    if (! await User.findOne({phone:'1234'}) ) {
        try {
            await User.create({
                full_name: 'admin',
                phone: '1234',
                password: '1234',
                role: roles.ADMINSTRATOR,
                city: 'Tehran',
                country_code: '0098'
            });
            console.log('seeding admin has been completed successfully . The admin panel is available with the number 1234 and password 1234')
        } catch (e) {
            console.log(e);
            process.exit(1);
        }
    }
    process.exit(0);
});

