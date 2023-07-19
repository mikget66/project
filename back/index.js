import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import query from './Database/DBConnection.js';






const app = express();
app.use(cors());





app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));










app.listen(5000, () => {
    console.log("Server is running on port 5000");
});