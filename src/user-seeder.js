const path = require('path');
const appDir = path.dirname(require.main.filename);
const LibraryDir = path.join(appDir,'app','Libraries');
require(path.join(LibraryDir,'Dotenv.js'));

const connectDB = require('./config/database');
const { spawn, execSync } = require('child_process');
const roles = require('./app/Base/Constants/Role');
connectDB().then((r)=>{});

const User = require('./app/Modules/User/Models/User');

const exec = commands => {
    execSync(commands, { stdio: 'inherit', shell: true });
};

const spawnProcess = commands => {
    spawn(commands, { stdio: 'inherit', shell: true });
};
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter your name : ", (name) => {
    rl.question("Enter your phone : ", async (phone) => {
        rl.question("Enter your password : ", async (password) => {
            rl.question("Enter your country code (example:0098) : ", async (country_code) => {
                try {
                    await User.create({
                        full_name: name,
                        phone,
                        password,
                        role: roles.ADMINSTRATOR,
                        city: 'Tehran',
                        country_code
                    });
                    console.log('seeding has been completed successfully.')
                    process.exit(0);
                } catch (e) {
                    console.log(e);
                    process.exit(1);
                }
            });
        });
    });
});

