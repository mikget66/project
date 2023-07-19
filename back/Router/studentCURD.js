import express from "express";
import query from '../Database/DBConnection.js';
import { body, validationResult } from "express-validator";


const student = express();
student.use(express.Router());




export default student;

