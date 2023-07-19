import express from 'express';
import query from '../Database/DBConnection.js';
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import user from '../MiddleWare/checkStudent.js';
import checkmanager from '../MiddleWare/checkManager.js';


const authmanager = express();
authmanager.use(express.Router());





const key = "secretkey";



authmanager.post('/login',
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



            const manager = await query("SELECT * FROM manager WHERE manager_email = ? AND type = 0 ", [req.body.manager_email]);
            if (manager.length === 0) {
                error.push({ msg: "manager Does Not Exist" });
                return res.status(400).json({ manager: false, errors: error });
            } else if (manager[0].first_time === 0) {
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
                    req.session.type = 0;
                    return res.status(200).json({ manager: true, first: true });
                } else {
                    error.push({ msg: "Password is incorrect" });
                    return res.status(400).json({ manager: false, errors: error, first: true });
                }

            } else {
                const hashpass = await bcrypt.hash(req.body.password, 10);
                console.log(hashpass);
                console.log(manager[0].password);
                const checkpassword = await bcrypt.compare(req.body.password, manager[0].password);
                if (!checkpassword) {
                    error.push({ msg: "Password is incorrect" });
                    console.log(checkpassword)
                    return res.status(400).json({ manager: false, errors: error , first: false});
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
                    req.session.type = 0;
                    res.status(200).json({ manager: true , first: false});
                }
            }


        } catch (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: "Server Error" }] });
        }
});

authmanager.put('/resetpassword',
    checkmanager,
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
                error.push({ msg: "Password and Confirm Password are not the same" });
                return res.status(400).json({ errors: error });
            }
            
            const managerDate ={
                password: await bcrypt.hash(req.body.password, 10),
                first_time: 1
            }
            await query("UPDATE manager SET ? WHERE manager_id = ? AND type = 0", [managerDate, req.manager_id]);
            res.status(200).json({ msg: "Password Changed Successfully" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: "Server Error" }] });
        }
});








authmanager.get('/logout',
    checkmanager,
    async (req, res) => {
        try {
            req.session.destroy();
            res.status(200).json({ login: false, msg: "logout" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: "Server Error" }] });
        }
    });


export default authmanager;