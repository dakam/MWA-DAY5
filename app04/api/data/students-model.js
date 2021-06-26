const mongoose = require("mongoose");



const studentSchema = new mongoose.Schema({
    name: {
        type: String, 
    },
    GPA: Number,
});


mongoose.model("Student", studentSchema, "Students"); 
