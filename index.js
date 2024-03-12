const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 3000;
const authRouter = require('./routes/authRoute');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require("cookie-parser");

dbConnect();
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());

app.use('/api/user',authRouter);

app.use(notFound);
app.use(errorHandler)

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
});