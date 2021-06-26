
const mongoose = require("mongoose");
const Student = mongoose.model("Student");

const statuses = {
    systemissue: 500,
    userIssue:400,
    fetchok:200,
    updateok:204,  
    resreceived:201,
}



module.exports.StudentsGetAll= function(req, res) {

    let offset = 0;
    let count = 6;

    if(req.query && req.query.offset && req.query.count) {

        let offset = parseInt(req.query.offset, 0);
        let count = parseInt(req.query.count, 6);
           
        Student.find().skip(offset).limit(count).exec(function(err, fetchedstudents) {
            console.log("Found Students");
            res.status(200).json(fetchedstudents);
        });      
    }
    else {
     
        Student.find().exec(function(err, fetchedstudents) {
            console.log(`We fetched Students ${fetchedstudents}`);
            res.status(200).json(fetchedstudents);

        });

    }

   

}


module.exports.StudentsGetOne = function(req, res) {

  

    if(req.params.studentId) {

        const studentId = req.params.studentId;
        console.log("student id received", studentId);

        Student.findById(studentId).exec(function(err, students) {

           let  response = {
                message:students,
                status:200,
            }

            console.log("One Found Students", students);

            if(err) {

                response.message= err;
                response.status= statuses.systemissue;
                console.log(`we encountered an Error : ${err}`)
            }
            res.status(200).json(response.message);
         

        });

    } else {
        response.message  = "missing studentId";

        res.status(statuses.userIssue).json({"message":response.message});  

    }

}


module.exports.StudentsAddOne = function (req, res) {
    console.log("new Game Add command received ");
   
    const newStudent = {
        name: req.body.name,
        GPA: parseFloat(req.body.GPA),
        
    };

    Student.create(newStudent, function (err, student) {
        const response = {
            status: statuses.resreceived,
            message: student
        };

        if (err) {
            console.log("There is an issue adding new Student");
            response.status = statuses.systemissue;
            response.message = err;
        }
        console.log("Added Game", student)
        res.status(response.status).json(response.message);
    });
}


module.exports.StudentsFullUpdateOne = function (req, res) {
    console.log("Received Full Student update command")
    const studentId = req.params.studentId;
    if (studentId.length != 24) {
        res.status(statuses.userIssue).json({ "message": "studentId is not valid" });
        
    }

    Student.findById(studentId).exec(function (err, student) {

        const response = {
            status: 204,
            message: student
        };


        if (err) {
            console.log("Ann error was encounted while find the Student");
            response.status = statuses.systemissue;
            response.message = err;
        } 
        
        if (!student) {
            response.status = statuses.userIssue;
            response.message = { "message": "This Student specified is not found" };
        }

        if (response.status !== statuses.updateok) {
           res.status(response.status).json(response.message);
        } else {
            

            console.log("we are updating the game here")
            student.name = req.body.name;
            student.GPA = parseFloat(req.body.GPA);
           
     

            student.save(function (err, updatedStudent) {
                console.log("updated Student is ", updatedStudent);

                if (err) {
                    response.status = statuses.systemError;
                    response.message = err;
                    console.log(" failure on game Full update", err)
                } else {
                    response.message = updatedStudent;
                    console.log(" success on Student Full update", updatedStudent)
                    res.status(response.status).json({"message": updatedStudent});
                }
               
            })


        }

    });
};


module.exports.StudentsPartialUpdateOne = function (req, res) {
    console.log("Partial Update Request Received")

    const studentId = req.params.studentId;

    if (studentId.length != 24) {
        res.status(statuses.userIssue).json({ "message": "Please send a valid studentId" });
    }

    Student.findById(studentId).exec(function (err, student) {
        const response = {
            status: 204,
            message: student
        };

        console.log("partial Student update here", student)

        if (err) {
            console.log("Error finding game");
            response.status = statuses.systemissue;
            response.message = err;
        } else if (!student) {
            response.status = statuses.userIssue;
            response.message = { "message": "Game ID not found" };
        }

        if (response.status !== 204) {
            res.status(response.status).json(response.message);
        } else {

            console.log("Currently here", req.body);
          

            if (req.body.name) {
                student.name = req.body.name;
            }

            if (req.body.GPA) {
                student.GPA = parseFloat(req.body.GPA);
            }

  

            student.save(function (err, updatedStudent) {
                console.log("updated partial game", updatedStudent)
                if (err) {
                    response.status = statuses.systemissue;
                    response.message = err;
                } else {
                    response.message = updatedStudent;
                }

                res.status(response.status).json(response.message);


                return;
            })


        }

    });
};


module.exports.StudentsDeleteOne = function (req, res) {

    const studentId = req.params.studentId;
    console.log("Student ID IS ", studentId);

    if(studentId.length !=24) {
        console.log("studentId is not a valid ID")
        res.status(400).json({"message":"studentId  is not valid"}); 
        return;
    }


    Student.findByIdAndRemove(studentId).exec(function(err, deletedStudent) {

            let response= {
                status:201,
                message:deletedStudent
            }

  
            if(err) {
                console.log("Error finding Student", err);
                response.status=500;
                response.message=err;
               
            } else if(!deletedStudent){

            console.log("Student ID no found");
          
            response.status=400;
            response.message="Student no found";

            }
           

            res.status(response.status).json(response.message);

        });

};