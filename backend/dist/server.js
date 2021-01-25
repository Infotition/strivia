"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const cors = require('cors');
require('dotenv').config({
    path: `../config/index.env`
});
const { PORT } = process.env;
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/strivia/', require('./routes/strivia.route'));
app.get('/', (_req, res) => {
    res.status(200).json({
        success: true,
        msg: 'strivia server'
    });
});
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        msg: 'page not found'
    });
});
app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
});
