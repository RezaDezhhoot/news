const {connect: connect1} = require('mongoose')
const connectDB = async () => {
    try {
        const conn = await connect1(process.env.MONGO_URI,{
            serverSelectionTimeoutMS: 100000, // Increase the timeout (in milliseconds)
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDB;
