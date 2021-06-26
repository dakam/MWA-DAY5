const mongoose = require("mongoose");
require("./games-model");

const dbName = "meanGames";
const dburl = "mongodb://localhost:27017/"+dbName;

mongoose.connect(dburl, {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on("connected!", function () {
    console.log("Mongoose connected ", dburl); 
});

mongoose.connection.on("Disconnected!", function () {
    console.log("Mongoose Disconnected");
});

mongoose.connection.on("Error", function (err) {
    console.log("Mongoose Connection error ", err);
});

process.on("SIGINT", function() {
    mongoose.connection.close(function() {
        console.log("Send disconncet to mongoose because of application termination");
        process.exit(0);
    })
})

process.on("SIGTERM", function() {
    mongoose.connection.close(function() {
        console.log("Send disconncet to mongoose because of application termination");
        process.exit(0);
    })
})

process.on("SIGUSR2", function() {
    mongoose.connection.close(function() {
        console.log("Send disconncet to mongoose because of application restart");
        process.kill(process.pid, "SIGUSR2");
    })
})