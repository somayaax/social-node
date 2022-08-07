const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(process.env.LOCAL_CONNECTION).then((res) => {
        console.log('connected to DB');
    }).catch((err) => {
        console.log('failed to connect to DB', err);
    })
}

module.exports = connectDB