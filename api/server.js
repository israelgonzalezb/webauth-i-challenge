const express = require("express");

const usersRouter = require("../users/users-router.js");

server.use("/api/users", usersRouter);

module.exports = server;
