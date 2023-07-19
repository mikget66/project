import express from "express";
import query from '../Database/DBConnection.js';
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import cors from "cors";
import upload from '../MiddleWare/Uplodeimgs.js';
import fs from 'fs';
import user from "../MiddleWare/checkStudent.js";
import e from "cors";


const program = express();
program.use(express.Router());
program.use(cors());

program.get('/getprogram',

    async (req, res) => {
        try {
            let search = "";
            if (req.query.search) {
                search = `where programs_of_department.program_name LIKE '%${req.query.search}%'`;
            }

            const programdetails = await query(`SELECT  * FROM programs_of_department ${search}`);

            res.status(200).json(programdetails);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Server Error" });
        }
}
);

export default program;
