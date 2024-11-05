const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOURL)
.then(function(){
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
    
})


module.exports = mongoose.connection;