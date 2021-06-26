
const express = require("express");
const controllerStudents = require("../controllers/studentsController");


const router = express.Router();

//Game
router.route("/students")
    .get(controllerStudents.StudentsGetAll)
    .post(controllerStudents.StudentsAddOne);

router.route("/students/:studentId")
    .get(controllerStudents.StudentsGetOne)
    .patch(controllerStudents.StudentsPartialUpdateOne)
    .delete(controllerStudents.StudentsDeleteOne)
    .put(controllerStudents.StudentsFullUpdateOne)






module.exports = router;
