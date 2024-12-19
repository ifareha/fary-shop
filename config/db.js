const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOURL),{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false, // Disable buffering
    connectTimeoutMS: 30000, // Increase timeout
    socketTimeoutMS: 30000 
}

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});


module.exports = mongoose.connection;