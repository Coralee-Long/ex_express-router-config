const express = require("express");
const app = express();
const PORT = process.env.PORT || 3002;
const pool = require("./client");
const userRouter = require("./routes/userRouter");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
require("dotenv").config();

app.use("/users", userRouter);

app.listen(PORT, console.log(`Server is listening on port ${PORT}`));
