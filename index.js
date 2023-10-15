require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const contactRouter = require("./routes/contactsRouter");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const DB = process.env.MONGODB_URL;

app.use(contactRouter);

// connect to mongodb instance
mongoose.connect(DB).then(() => {
  console.log("MongoDB Connected successfully");
}).catch((e) => {
    console.log(e);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`App running on PORT: ${PORT}`);
});

module.exports = app;