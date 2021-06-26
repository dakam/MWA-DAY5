const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    address: String,
    location: {
        coordinates: {
            type: [Number],
            index: "2dsphere",
        } //longitude(E/W), latitude(N/S)
    },
});

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },

    price: Number,
    year: Number,

    minPlayers: {
        type: Number,
        min:1,
        max: 10,
    },

    maxPlayers: {
        type: Number,
        min:1,
        max: 10,
    },

    minAge: {
        type: Number,
        min: 4
    },

    rate: {
        type: Number,
        min:1,
        max: 5,
        "default": 1
    },

    designers: [String], 

    publisher: [publisherSchema]
});


//Adding the 3rd parametr is optional, you can add collection name as a 3rd parameter
mongoose.model("Game", gameSchema, "games"); 
