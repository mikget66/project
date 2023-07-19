import express from "express";
import query from '../Database/DBConnection.js';
import { body, validationResult } from "express-validator";


const student = express();
student.use(express.Router());

student.get("/allstudents",
    async (req, res) => {
        try {
            const sqlSelect = "SELECT * FROM students";
            const result = await query(sqlSelect);
            if (result.length > 0) {
               return res.status(200).json(result);
            }else{
                return res.status(400).json({message:"No Students Found"});
            }

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
});


student.get("/allstudentMaterial",
    async (req, res) => {
        try {
            const sqlSelect = "SELECT materialstdsem1.*, students.student_name, students.national_id ,students.student_id ,  material.* FROM materialstdsem1 INNER JOIN students ON materialstdsem1.student_id = students.student_id INNER JOIN material ON materialstdsem1.material_code = material.material_code";
            const result = await query(sqlSelect);
            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(400).json({ message: "No Students Found" });
            }

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
});

student.get("/allstudentMaterialone/:id",
    async (req, res) => {
        try {
            const id = req.params.id;
            const sqlSelect = "SELECT materialstdsem1.*, students.name, students.national_id ,students.student_id ,  material.* FROM materialstdsem1 INNER JOIN students ON materialstdsem1.student_id = students.student_id INNER JOIN material ON materialstdsem1.material_code = material.material_code WHERE materialstdsem1.student_id = ?";
            const result = await query(sqlSelect, [id]);
            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(400).json({ message: "No Students Found" });
            }
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
});

student.post("/addopinalmaterialsem1",
    body('material_code').notEmpty().withMessage('material_code is required'),
    body('student_id').notEmpty().withMessage('student_id is required'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array() });
            }
            const sql = "INSERT INTO materialstdsem1 (material_code, student_id) VALUES (?,?)";
            const VALUES = [req.body.material_code, req.body.student_id];
            const result = await query(sql, VALUES);
            if (result.affectedRows > 0) {
                return res.status(200).json({ message: "Material Added Successfully" });
            } else {
                return res.status(400).json({ message: "Material Not Added" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
});






export default student;

