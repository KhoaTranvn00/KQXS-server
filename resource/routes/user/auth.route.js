const route = require("express").Router();

const controller = require("../../controllers/user/auth.controller");

route.post("/register", controller.register);

module.exports = route;
