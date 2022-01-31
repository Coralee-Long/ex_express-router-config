const userRouter = require("express").Router();
const { user } = require("pg/lib/defaults");
const pool = require("../client");
const checkUser = require("../middleware/checkUser");
const { body, check, validationResult } = require("express-validator");

////// VALIDATOR
const Validator = [
  body("first_name")
    .isLength({ min: 1, max: 50 })
    .isString()
    .withMessage("first name cannot be empty"),
  body("last_name").isLength({ min: 1, max: 50 }).isString(),
  body("age").isInt({ min: 18, max: 105 }),
  //   body("id").isInt({ min: 18, max: 105 }),
];

// VALIDATOR II
// const Validator2 = [check("id").notEmpty().withMessage("id cannot be empty")];

//// GET ALL USERS
userRouter.get("/", (req, res) => {
  pool
    .query("SELECT * FROM users;")
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500));
});

///// GET ONE USER BY ID
userRouter.get("/:id", checkUser, (req, res) => {
  const { id } = req.params;
  pool
    .query("SELECT * FROM users WHERE id=$1;", [id])
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500));
});

userRouter.post("/", Validator, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { first_name, last_name, age } = req.body;
  if (!req.body.first_name || !req.body.last_name) {
    res.sendStatus(400);
  } else {
    pool
      .query(
        "INSERT INTO users(first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *;",
        [first_name, last_name, age]
      )
      .then((data) => res.status(201).json(data))
      .catch((e) => res.sendStatus(404));
  }
});

userRouter.put("/:id", checkUser, (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age } = req.body;
  if (!first_name || !last_name) {
    res.sendStatus(400);
  } else {
    pool
      .query(
        "UPDATE users SET first_name = $1, last_name = $2, age = $3 WHERE id=$4 RETURNING *",
        [first_name, last_name, age, id]
      )
      .then((data) => res.json(data.rows))
      .catch((e) => res.sendStatus(500));
  }
});

userRouter.delete("/:id", checkUser, (req, res) => {
  const { id } = req.params;

  pool
    .query("DELETE FROM users WHERE id=$1 RETURNING *", [id])
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500));
});

module.exports = userRouter;
