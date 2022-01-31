const pool = require("../client");

const checkUser = (req, res, next) => {
  const { id } = req.params;
  pool
    .query("SELECT * FROM users WHERE id=$1", [id])
    .then((data) => {
      if (!data.rows[0]) return res.sendStatus(404);
      next();
    })
    .catch((e) => console.log(e));
};

module.exports = checkUser;
