const {connect: connect1} = require('mongoose')
const connectDB = async () => {
    try {
        const conn = await connect1(process.env.MONGO_URI);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDB;
