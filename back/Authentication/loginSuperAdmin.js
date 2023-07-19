import express from 'express';
import query from '../Database/DBConnection.js';
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import user from '../MiddleWare/checkStudent.js';
import e from 'express';
import checkSuperAdmin from '../MiddleWare/checkSuperAdmin.js';


const loginsuperAdmin = express();
loginsuperAdmin.use(express.Router());





const key = "secretkey";



loginsuperAdmin.post('/login',
    body('email').notEmpty().withMessage('Email is required'),
    body("password").isLength({ min: 3 }).withMessage("password must be at least 3 chars long!"),
    async (req, res) => {
        try {
            let error = [];
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                error = errors.array();
                return res.status(400).json({ errors: error });
            }



            const superadmin = await query("SELECT * FROM admin WHERE email = ? ", [req.body.email]);
            console.log(superadmin);
            if (superadmin.length === 0) {
                error.push({ msg: "admin Does Not Exist" });
                return res.status(400).json({ admin: false, errors: error });
            } else if (superadmin[0].first_time === 0) {
                if (superadmin[0].password === req.body.password) {
                    delete superadmin[0].password;
                    const payload = {
                        id: superadmin[0].id,
                        email: superadmin[0].email,
                    };
                    const token = jwt.sign(payload, key);
                    req.session.token = "Bearer " + token;
                    return res.status(200).json({ admin: true, first: true });
                } else {
                    error.push({ msg: "Password is incorrect" });
                    return res.status(400).json({ admin: false, errors: error, first: true });
                }

            } else {
                const checkpassword = await bcrypt.compare(req.body.password, superadmin[0].password);
                if (!checkpassword) {
                    error.push({ msg: "Password is incorrectt" });
                    return res.status(400).json({ admin: false, errors: error, first: false });
                }

                delete superadmin[0].password;

                const payload = {
                    id: superadmin[0].id,
                    email: superadmin[0].email,
                };

                const token = jwt.sign(payload, key);
                req.session.token = "Bearer " + token;
                req.session.type = 2;
                res.status(200).json({ admin: true, first: false });
            }


        } catch (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: "Server Error" }] });
        }
    });

loginsuperAdmin.put('/reset',
    checkSuperAdmin,
    body('password').isLength({ min: 3 }).withMessage("password must be at least 3 chars long!"),
    body('confirmPassword').isLength({ min: 3 }).withMessage("password must be at least 3 chars long!"),
    async (req, res) => {
        try {
            let error = [];
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                error = errors.array();
                return res.status(400).json({ errors: error });
            }

            if (req.body.password !== req.body.confirmPassword) {
                error.push({ msg: "Password and Confirm Password does not match" });
                return res.status(400).json({ errors: error });
            }

            const adminData = {
                password: await bcrypt.hash(req.body.password, 10),
                first_time: 1
            }

            const sqlUpdate = await query("UPDATE admin SET ? WHERE id = ?", [adminData, req.id]);
            if (sqlUpdate.affectedRows === 0) {
                error.push({ msg: "Password is incorrect" });
                return res.status(400).json({ errors: error });
            }

            res.status(200).json({ msg: "Password Updated" });

        } catch (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: "Server Error" }] });
        }
    });






loginsuperAdmin.get('/logout',
    user,
    async (req, res) => {
        try {
            req.session.destroy();
            res.status(200).json({ admin: false, msg: "logout" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ errors: [{ msg: "Server Error" }] });
        }
    });


export default loginsuperAdmin;