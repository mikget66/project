import express from 'express';
import query from '../Database/DBConnection.js';
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import user from '../MiddleWare/checkStudent.js';
import checkadmin from '../MiddleWare/checkAdmin.js';


const authadmin = express();
authadmin.use(express.Router());





const key = "secretkey";



authadmin.post('/login',
    body('manager_email').notEmpty().withMessage('Email is required'),
    body("password").isLength({ min: 3 }).withMessage("password must be at least 3 chars long!"),
    async (req, res) => {
        try {
            let error = [];
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                error = errors.array();
                return res.status(400).json({ errors: error });
            }



            const manager = await query("SELECT * FROM manager WHERE manager_email = ? AND type = 1 ", [req.body.manager_email]);
            if (manager.length === 0) {
                error.push({ msg: "manager Does Not Exist" });
                return res.status(400).json({ login: false, errors: error });
            }else if (manager[0].first_time === 0) {
                if (manager[0].password === req.body.password) {
                    delete manager[0].password;
                    const payload = {
                        manager_id: manager[0].manager_id,
                        manager_email: manager[0].manager_email,
                        faculty_id: manager[0].faculty_id,
                        type: manager[0].type
                    };
                    const token = jwt.sign(payload, key);
                    req.session.token = "Bearer " + token;
                    req.session.type = 1;
                    return res.status(200).json({ admin: true, first: true });
                } else {
                    error.push({ msg: "Password is incorrect" });
                    return res.status(400).json({ admin: false, errors: error, first: true });
                }

            } else {
                const checkpassword = await bcrypt.compare(req.body.password, manager[0].password);
                if (!checkpassword) {
                    error.push({ msg: "Password is incorrect" });
                    return res.status(400).json({ admin: false, errors: error ,first: false});
                } else {

                    delete manager[0].password;
                    const payload = {
                        manager_id: manager[0].manager_id,
                        manager_email: manager[0].manager_email,
                        faculty_id: manager[0].faculty_id,
                        type: manager[0].type
                    };
                    const token = jwt.sign(payload, key);
                    req.session.token = "Bearer " + token;
                    req.session.type = 1;
                    return res.status(200).json({ admin: true ,first: false });
                }
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: "Server Error" }] });
        }
});



          


authadmin.put('/resetPassword',
    checkadmin,
    body("password").isLength({ min: 8 }).withMessage("password must be at least 3 chars long!"),
    body("confirmPassword").isLength({ min: 8 }).withMessage("password must be at least 3 chars long!"),
    async (req, res) => {
        try {
            let error = [];
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                error = errors.array();
                return res.status(400).json({ errors: error });
            }

            if (req.body.password !== req.body.confirmPassword) {
                error.push({ msg: "Password is not match" });
                return res.status(400).json({ errors: error });
            }

            const adminData ={
                password: await bcrypt.hash(req.body.password, 10),
                first_time: 1
            }

            await query("UPDATE manager SET ? WHERE manager_id = ? AND type = 1", [adminData, req.manager_id]);
            res.status(200).json({ reset: true });
        } catch (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: "Server Error" }] });
        }
}


)





authadmin.get('/logout',
    checkadmin,
    async (req, res) => {
        try {
            req.session.destroy();
            res.status(200).json({ login: false, msg: "logout" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: "Server Error" }] });
        }
    });


export default authadmin;