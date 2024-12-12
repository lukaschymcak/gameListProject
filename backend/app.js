const express = require("express");
const cors = require("cors");

const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE , OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(cors({
    origin: true,


    credentials: true,
       

    methods: 'POST,GET,PUT,OPTIONS,DELETE'
}));
app.use((req, res, next) => {
    res.status(404).send("Not found");
});

module.exports = app;