const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
if (process.env.NODE_env !== "production") {
    require("dotenv").config({ path: "backend/config/config.env" });
}


//Using Middlewares       using req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

//Importing Routes

const user = require("./routes/user");
const pet = require("./routes/pet");
const category = require("./routes/category");
const store = require("./routes/store");
//Using Routes

app.use("/user", user);
app.use("/pet", pet);
app.use("/category", category);
app.use("/store", store);

module.exports = app;