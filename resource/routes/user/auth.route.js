const route = require("express").Router();

const controller = require("../../controllers/user/auth.controller");
const middleware = require("../../controllers/user/middleware.controller");

route.post("/register", controller.register);
route.post("/login", controller.login);
route.get("/load", middleware.verifyToken, controller.loadUser);

module.exports = route;
