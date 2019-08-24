const express = require("express");
const router = express.Router();

const Users = require("./users-model.js");
const restricted = require("../auth/restricted-middleware.js");

router.get("/", restricted, async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
