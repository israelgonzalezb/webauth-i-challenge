const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const Users = require("./users-model.js");

const router = express.Router();

const server = express();

server.use(helmet());
server.use(express.json());

// register a user
server.post('/api/register', async (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  
  const newUser = await Users.add(user);
  try{
    res.status(201).json(newUser);
  }
  catch(err) {
    res.status(500).json({message: "There was an error dude", error: err})
  }
});

async function validate(req, res, next) {
  const {username, password} = req.headers;

  if (username && password) {
    const user = await Users.findBy({username}).first();
    try {
      if (user && bcrypt.compareSync(password, user.password)) {
        next();
      } else {
        res.status(401).json({message: "Invalid credentials"});
      }
    }
    catch(err) {  res.status(500).json({message:"There was an error". error: err});
    }
  } else {
    res.status(400).json({message:"no credentials provided"});
  }
}



module.exports = router;