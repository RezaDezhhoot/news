const connectDB = require('./config/database');
const dotenv = require('dotenv');
const { spawn, execSync } = require('child_process');
const roles = require('./app/Base/Constants/Role');
dotenv.config({path:'./.env'});
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
            try {
                await User.create({
                    full_name: name,
                    phone,
                    password,
                    role: roles.ADMINSTRATOR
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

