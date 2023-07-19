import express from 'express';
import query from '../Database/DBConnection.js';
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import upload from '../MiddleWare/Uplodeimgs.js';
import fs from 'fs';
import user from '../MiddleWare/checkStudent.js';

const newApp = express();
newApp.use(express.Router());
newApp.use(cors());


const key = "secretkey";

newApp.post('/signup',
    upload,
    body('name').notEmpty().withMessage('Name is required').isLength({ min: 3 }).withMessage('Name must be at least 3 chars long'),
    body('email').isEmail().withMessage('Not a valid e-mail address'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 chars long and must contain special character'),
    body('checkpassword').notEmpty().withMessage('checkpassword is required'),
    body('phone').notEmpty().withMessage('phone is required'),
    body('national_id').notEmpty().withMessage('nationalId is required'),
    body('dateOfBirth').notEmpty().withMessage('dateOfBirth is required'),
    body('gender').notEmpty().withMessage('gentder is required'),
    body("level").notEmpty().withMessage('Educational_level is required'),
    body("faculty").notEmpty().withMessage('faculty_id is required'),
    body("department").notEmpty().withMessage('department_id is required'),
    body("program").notEmpty().withMessage('program_id is required'),
    body("length_of_file").notEmpty().withMessage('length_of_file is required'),
    async (req, res) => {
        try {
            
            

            /*==================================  check if the data is valid  ==================================*/
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                hanleDelUplodes(req);
                return res.status(400).json({ errors:{msg: errors.array().map((err) => err.msg) }});
            }
            /*==================================  check if the data is valid  ==================================*/



            /*==================================  check if upload all the required files  ==================================*/
            console.log(Object.keys(req.files).length);
            console.log(req.body.length_of_file);
            if (req.body.length_of_file != Object.keys(req.files).length || Object.keys(req.files).length == 0) {
                hanleDelUplodes(req);
                return res.status(400).json({ errors: { msg: ["Please upload all the required files"] } });
            }
            // console.log(req.files);
            // console.log(req.body.length_of_file);

            /*==================================  check if upload all the required files  ==================================*/


            /*==================================  check if all the files are image  ==================================*/

            for (let i = 1; i <= 9; i++) {
                
                if (!req.files[`image${i}`]) {
                    continue;
                }
                // console.log(req.files[`image${i}`][0].mimetype);
                let file = req.files[`image${i}`][0].mimetype || 0;
                if (file != "image/jpeg" && file != "image/jpg" && file != "image/png" && file != "image/webp" && file != "application/pdf"){
                    hanleDelUplodes(req);
                    return res.status(400).json({ errors: { msg: ["Please upload all the required files as image"] } });
                }
            }
            /*==================================  check if all the files are image  ==================================*/

            /*==================================  check if password and checkpassword are the same  ==================================*/
            
            
            if (req.body.password !== req.body.checkpassword) {
                hanleDelUplodes(req);
                return res.status(400).json({ errors: { msg: ["Password does not match"] } });
            }
            
            
            /*==================================  check if password and checkpassword are the same  ==================================*/




            /*==================================  check if the file is image or not and check size  ==================================*/


            const maxFileSize = 1024 * 1024 * 2;
            const sizeinMB = maxFileSize / (1024 * 1024);
            let number_of_files = 9;

            const array_of_filename_photo = [];
            for (let i = 1; i <= number_of_files; i++) {
                if (!req.files[`image${i}`]) {
                    array_of_filename_photo.splice(i, 0);
                    continue;
                }
                let file = req.files[`image${i}`][0].size || 0;
                if (file > maxFileSize) {
                    hanleDelUplodes(req);
                    let str ;
                    if(i == 1){
                        str = "Person ";
                    }else if(i == 2){
                        str = "National ID ";
                    }else if(i == 3){
                        str = "Birth Certificate ";
                    }else if(i == 4){
                        str = "Academic Qualification ";
                    }else if(i == 5){
                        str = "Grade_Statement ";
                    }else if(i == 6){
                        str = "Good Conduct Form";
                    }else if(i == 7){
                        str = "Approval From Employer";
                    }else if(i == 8){
                        str = "Position On Military";
                    }else if(i == 9){
                        str = "Masters Photo";
                    }
                    return res.status(400).json({ errors: { msg: [`Please upload  ${str} Image less than ${sizeinMB} MB `] } });
                }
            }
            /*==================================  check if the file is image or not and check size ==================================*/




            /*==================================  store the file name in array  ==================================*/
            for (let i = 1; i <= 9; i++) {
                if (!req.files[`image${i}`]) {
                    array_of_filename_photo.push(0);
                } else {
                    array_of_filename_photo.push(req.files[`image${i}`][0].filename);
                }
            }
            /*==================================  store the file name in array  ==================================*/


            /*==================================  store the student data in object  ==================================*/
            const studentData = {
                student_name: req.body.name,
                password: await bcrypt.hash(req.body.password, 10),
                national_id: req.body.national_id,
                email: req.body.email,
                phonenumber: req.body.phone,
                gender: req.body.gender,
                level: req.body.level,
                birthdate: req.body.dateOfBirth,
                military_status: req.body.military_status,
                img: array_of_filename_photo[0],
                photo_national_id: array_of_filename_photo[1],
                birth_certificate: array_of_filename_photo[2],
                academic_qualification: array_of_filename_photo[3],
                grade_statement: array_of_filename_photo[4],
                good_conduct_form: array_of_filename_photo[5],
                approval_from_employer: array_of_filename_photo[6],
                position_on_military: array_of_filename_photo[7],
                masters_photo: array_of_filename_photo[8],
            };
            /*==================================  store the student data in object  ==================================*/

            /*==================================  insert the student data in database  ==================================*/
            let student_id;
            const sqlInsert = "INSERT INTO `students` SET ?";
            await query(sqlInsert, studentData, (err, result) => {
                delete studentData.password;
                if (err) {
                    hanleDelUplodes(req);
                    return res.status(400).json({ errors: { msg: err } });
                } else {
                    student_id = result.insertId;
                    const applicationData = {
                        student_id: student_id,
                        faculty_id: req.body.faculty,
                        department_id: req.body.department,
                        program_id: req.body.program,
                        status: "2",
                        submission_date: new Date(),
                    };
                    const sqlInsert2 = "INSERT INTO `application` SET ?";
                    query(sqlInsert2, applicationData, (err, result) => {
                        if (err) {
                            hanleDelUplodes(req);
                            return res.status(400).json({ errors: { msg: err } });
                        } else {
                            return res.status(200).json({ msg: "Student added successfully", studentData });
                        }
                    });

                }
            });


            /*==================================  insert the student data in database  ==================================*/





        } catch (err) {
            console.log(err);
            res.status(500).json({ errors: { msg: err }, "msg": "Server Error" });
        }

    });


export default newApp;


function hanleDelUplodes(req) {
    let file = req.files;
    if (file) {
        for (let i = 1; i <= 9; i++) {
            if (file[`image${i}`]) {
                fs.unlinkSync(`./public/imgs/${req.body.national_id}/${file[`image${i}`][0].filename}`);
            }
        }
    }
}

