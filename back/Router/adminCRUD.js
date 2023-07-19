import express from "express";
import query from '../Database/DBConnection.js';
import { body, validationResult } from "express-validator";
import checkadmin from "../MiddleWare/checkAdmin.js";

const admin = express();
admin.use(express.Router());



// admin.get('/allaaplicationinfaculty',
//     async (req, res) => {
//         try {
//             let search = "";
//             if (req.query.search) {
//                 search = `where faculty.faculty_id LIKE '%${req.query.search}%'`;
//             }

//             const admindetails = await query(`SELECT  faculty.faculty_name , application.status ,application.submission_date , students.* ,departments_of_faculty.department_name , programs_of_department.program_name FROM application inner join students on application.student_id = students.student_id inner join faculty on application.faculty_id = faculty.faculty_id inner join departments_of_faculty on application.department_id = departments_of_faculty.department_id inner join programs_of_department on application.program_id = programs_of_department.program_id ${search}`);

//             res.status(200).json(admindetails);
//         } catch (err) {
//             console.log(err);
//             res.status(500).json({ msg: "Server Error" });
//         }
//     });
admin.get('/allaaplication',
    checkadmin,
    async (req, res) => {
        try {
            console.log(req.faculty_id);
            let search = "";
            if (req.query.search) {
                search = `where faculty.faculty_id LIKE '%${req.query.search}%'`;
            }

            const admindetails = await query(`SELECT  faculty.faculty_name , faculty.faculty_name_ar,application.status ,application.submission_date , students.* ,departments_of_faculty.department_name , departments_of_faculty.department_name_ar , programs_of_department.program_name FROM application inner join students on application.student_id = students.student_id inner join faculty on application.faculty_id = faculty.faculty_id inner join departments_of_faculty on application.department_id = departments_of_faculty.department_id inner join programs_of_department on application.program_id = programs_of_department.program_id WHERE faculty.faculty_id = ? AND application.status = 1 OR application.status = 4 OR application.status = 5`, [req.faculty_id]);
            delete admindetails[0].password;
            res.status(200).json(admindetails);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Server Error" });
        }
    });



admin.post('/adddepartment',
    checkadmin,
    body('department_name').notEmpty().withMessage('department_name is required'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: { msg: errors.array().map((err) => err.msg) } });
            }

            const sqlcheck = "SELECT * FROM departments_of_faculty WHERE department_name  = ? AND faculty_id = ?";
            const value = [req.body.department_name, req.faculty_id];
            const department = await query(sqlcheck, value);
            if (department[0]) {
                return res.status(400).json({ errors: [{ msg: "department is already exists !" }] });
            }

            const departmentData = {
                department_name: req.body.department_name,
                faculty_id: req.faculty_id,
                department_name_ar : req.department_name_ar ,
            };

            const sqlInsert = "INSERT INTO departments_of_faculty SET ?";
            const values = [departmentData];
            await query(sqlInsert, values, (err, result) => {
                if (err) {
                    return res.status(400).json({ errors: [{ msg: `Error: ${err} ` }] });
                } else {
                    res.status(200).json({ msg: "department Added Successfully" });
                }
            });

        } catch (err) {
            res.status(500).json({ errors: [{ msg: `Error: ${err} ` }] });
        }
    });

admin.get('/alldepartment',
    checkadmin,
    async (req, res) => {
        try {
            let search = "";
            if (req.query.search) {
                search = `where faculty.faculty_id LIKE '%${req.query.search}%'`;
            }

            const admindetails = await query(`SELECT  faculty.faculty_name ,faculty.faculty_name_ar, departments_of_faculty.* FROM departments_of_faculty inner join faculty on departments_of_faculty.faculty_id = faculty.faculty_id where faculty.faculty_id = ${req.faculty_id}`);
            res.status(200).json(admindetails);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Server Error" });
        }
    });




admin.put('/updatedepartment/:id',
    body('department_name').notEmpty().withMessage('department_name is required'),
    body('faculty_id').notEmpty().withMessage('faculty_id is required'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: { msg: errors.array().map((err) => err.msg) } });
            }



            const sqlcheck1 = "SELECT * FROM departments_of_faculty WHERE department_id = ?";
            const value1 = [req.params.id];
            const department1 = await query(sqlcheck1, value1);

            if (!department1[0]) {
                return res.status(404).json({ errors: [{ msg: "department not found !" }] });
            }

            const departmentData = {
                department_name: req.body.department_name,
                department_name_ar : req.body.department_name_ar
            };

            const sqlUpdate = "UPDATE departments_of_faculty SET ?  WHERE department_id = ?";
            const values = [departmentData, req.params.id];
            await query(sqlUpdate, values, (err, result) => {
                if (err) {
                    return res.status(400).json({ errors: [{ msg: `Error: ${err} ` }] });
                } else {
                    res.status(200).json({ msg: "department Updated Successfully" });
                }
            });

        } catch (err) {
            res.status(500).json({ errors: [{ msg: `Error: ${err} ` }] });

        }

    });



admin.put('/updatestatus/:id',
    checkadmin,
    body('status').notEmpty().withMessage('status is required'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: { msg: errors.array().map((err) => err.msg) } });
            }


            const sqlcheck1 = "SELECT * FROM application WHERE student_id = ?";
            const value1 = [req.params.id];
            const application1 = await query(sqlcheck1, value1);
            if (!application1[0]) {
                return res.status(404).json({ errors: [{ msg: "Student not found !" }] });
            }


            const sqlUpdate = "UPDATE application SET status = ?  WHERE student_id = ?";
            const values = [req.body.status, req.params.id];
            await query(sqlUpdate, values, (err, result) => {
                if (err) {
                    return res.status(400).json({ errors: [{ msg: `Error: ${err} ` }] });
                }
                else {
                    res.status(200).json({ msg: "status Updated Successfully" });
                }
            });


        } catch (err) {

            res.status(500).json({ errors: [{ msg: `Error: ${err} ` }] });

        }

    });













export default admin;

