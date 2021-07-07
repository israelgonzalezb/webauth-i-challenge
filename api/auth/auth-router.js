const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Users = require("../users/users-model.js");

router.post("/register", async (req, res) => {
  
  let user = req.body;
  
  console.log(req.body);
  try {
    const newUser = await Users.add(user);
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    res.status(201).json(newUser);
  } catch (err) {
    res
      .status(500)
      .json({ message: "There was an error registering the user", error: err });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  req.session.loggedIn = false;

  
  try {
    const user = await Users.findBy({ username }).first();
    (user && bcrypt.compare(password, user.password))
      ? ((res.session.loggedIn = true),
        res.status(200).json({ message: `Welcome ${user.username}!` }))
      : res.status(401).json({ message: "Please try again" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.delete("/logout", (req, res) => {
  if (req.session) {
    req.sessions.destroy((err)=>{
      (err)
        ? res.status(400).json({message: "You can't leave..."})
        : res.send("Got away safely!");
    })
  } else {
    res.end();
  }
})

async function validate(req, res, next) {
  const { username, password } = req.headers;

  if (username && password) {
    const user = await Users.findBy({ username }).first();
    try {
      if (user && bcrypt.compareSync(password, user.password)) {
        next();
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (err) {
      res.status(500).json({ message: "There was an error", error: err });
    }
  } else {
    res.status(400).json({ message: "no credentials provided" });
  }
}

module.exports = router;