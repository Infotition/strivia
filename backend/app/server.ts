//* --------------- SERVER DEPENDENCIES --------------- *\\

//* Node modules
const express = require('express');
const cors = require('cors');

//* -------------- SERVER CONFIGURATION --------------- *\\

require('dotenv').config({
  path: `../config/index.env`
});

const { PORT } = process.env;

const app = express();

//* ------------------- MIDDLEWARES ------------------- *\\

app.use(cors());
app.use(express.json());

//* --------------------- ROUTES ---------------------- *\\

app.use('/api/strivia/', require('./routes/strivia.route'));

//* Homepage Route
app.get('/', (_req: any, res: any) => {
  res.status(200).json({
    success: true,
    msg: 'strivia server'
  });
});

//* Default route - page not found
app.use((_req: any, res: any) => {
  res.status(404).json({
    success: false,
    msg: 'page not found'
  });
});

//* ------------------ START SERVER ------------------- *\\

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});

export {};
